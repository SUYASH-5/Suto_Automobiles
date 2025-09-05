let express = require('express');
let app = express();
let session = require("express-session");
let bodyparser = require('body-parser');
let db = require('./database.js');
const { ObjectId } = require('mongodb');
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const bcrypt = require("bcrypt");
const multer = require('multer');
const jwt = require("jsonwebtoken");
const fsPromises = require('fs').promises;

app.use(session({ secret: "test123!@#", resave: true, saveUninitialized: true }));
app.use(bodyparser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
	destination: "public/uploads",
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
	}
});

const authenticateToken = (req, res, next) => {
	const token = req.headers['authorization']?.split(' ')[1];
	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' });

	}

	jwt.verify(token, SECRET_KEY, (err, user) => {
		if (err) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		req.user = user;
		next();
	});
};
const documentUpload = multer({
	storage: storage,
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|png|gif|pdf)$/))
			return cb(new error("only jpg,png, gif, pdf allowed"));
		cb(undefined, true);
	}
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5097152//5 mb file size limits
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|png|gif|pdf)$/))
			return cb(new error("only jpg,png, gif, pdf allowed"));
		cb(undefined, true);
	}
});
app.use(bodyparser.json());
app.use(cors());
app.use(session({
	secret: 'your-secret-key',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));

const SECRET_KEY = "your_secret_key";

app.post("/register", async (req, res) => {
	const { username, email, confirmPassword, phone } = req.body;
	try {
		const user = db.collection('user');
		const existingUser = await user.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists!" });
		}

		const hashedPassword = await bcrypt.hash(confirmPassword, 10);
		const newuser = {
			username,
			email,
			phone,
			password: hashedPassword,
			dealerStatus: 'none',
			dealerAddress: '',
			dealerDocument: ''
		};
		// console.log(newuser);
		await user.insertOne(newuser);
		res.status(201).json({ message: "User registered successfully!" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
});

app.post("/login", async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required!" });
	}

	try {
		const user = db.collection('user');
		const olduser = await user.findOne({ email });
		if (!olduser) {
			return res.status(400).json({ message: "Invalid email or password!" });
		}

		const isPasswordValid = await bcrypt.compare(password, olduser.password);
		if (!isPasswordValid) {
			return res.status(400).json({ message: "Invalid email or password!" });
		}

		const token = jwt.sign({ id: olduser._id, email: olduser.email }, SECRET_KEY, { expiresIn: "10h" });
		res.status(200).json({
			message: "Login successful!",
			token,
			user: {
				email: olduser.email,
				username: olduser.username
			}
		});
	} catch (error) {
		res.status(500).json({ message: "Internal server error", error: error.message });
	}
});

app.post('/auction/create', authenticateToken, upload.single('image'), async (req, res) => {
	try {
		const {
			username,
			make,
			model,
			year,
			miles,
			type,
			minimumBid,
			condition,
			auctionDuration,
			email
		} = req.body;
		const user = db.collection('user');
		const userid = await user.findOne({ email });
		// Create new auction in database
		const newAuction = {
			userid: userid._id,
			image: req.file.filename,
			email,
			sellerName: username,
			make,
			model,
			year: Number(year),
			miles: Number(miles),
			type,
			minimumBid: Number(minimumBid),
			condition,
			auctionDuration: Number(auctionDuration),
			endDate: new Date(Date.now() + Number(auctionDuration) * 24 * 60 * 60 * 1000),
			currentBid: Number(minimumBid),
			status: 'active'
		};
		const auction = db.collection('auction');
		await auction.insertOne(newAuction);
		res.status(201).json({ message: 'Auction created successfully', auction: newAuction });

	} catch (error) {
		console.error('Error creating auction:', error);
		res.status(500).json({ message: 'Error creating auction', error: error.message });
	}
});

app.put('/auction/bid/:id', authenticateToken, async (req, res) => {
	try {
		const { id } = req.params;
		const { bidAmount } = req.body;
		const auction = db.collection('auction');
		await auction.updateOne({ _id: new ObjectId(id) }, { $set: { currentBid: bidAmount } });
		res.json({ message: 'Bid placed successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error placing bid', error: error.message });
	}
});

app.get('/auction/cars', async function (req, res) {
	try {
		const auctions = db.collection('auction');
		const auctionlist = await auctions.find({ status: 'active' })
			.sort({ createdAt: -1 })
			.toArray(); // Add this line
		res.status(200).send({ auctionlist: auctionlist });
	} catch (error) {
		res.status(500).json({ message: 'Error fetching auctions', error: error.message });
	}
});

app.post('/usedcar/create', upload.single('image'), async (req, res) => {
	try {
		const {
			make,
			username,
			model,
			year,
			price,
			mileage,
			condition,
			type,
			email
		} = req.body;
		const user = db.collection('user');
		const userid = await user.findOne({ email });
		const newUsedCar = {
			userid: userid._id,
			image: req.file.filename,
			make,
			model,
			year: Number(year),
			price: Number(price),
			mileage: Number(mileage),
			condition,
			sellerName: username,
			email,
			type,
			createdAt: new Date(),
			status: 'active'
		};

		const usedCars = db.collection('usedcars');
		await usedCars.insertOne(newUsedCar);

		res.status(201).json({
			message: 'Used car listed successfully',
			car: newUsedCar
		});

	} catch (error) {
		console.error('Error creating used car listing:', error);
		res.status(500).json({
			message: 'Error creating used car listing',
			error: error.message
		});
	}
});

app.post('/newcars/create', upload.single('image'), async (req, res) => {
	try {
		const {
			make,
			model,
			username,
			year,
			price,
			engine,
			transmission,
			type,
			condition,
			email
		} = req.body;
		const user = db.collection('user');
		const userid = await user.findOne({ email });
		const newCar = {
			userid: userid._id,
			image: req.file.filename,
			make,
			model,
			year: Number(year),
			price: Number(price),
			engine,
			transmission,
			sellerName: username,
			email,
			type,
			condition,
			createdAt: new Date(),
			status: 'available'
		};

		const newCars = db.collection('newcars');
		await newCars.insertOne(newCar);

		res.status(201).json({
			message: 'New car listed successfully',
			car: newCar
		});

	} catch (error) {
		console.error('Error creating new car listing:', error);
		res.status(500).json({
			message: 'Error creating new car listing',
			error: error.message
		});
	}
});
app.get('/newcars/cars', async function (req, res) {
	try {
		const newCars = db.collection('newcars');
		const carlist = await newCars.find({})
			.sort({ createdAt: 1 })
			.toArray();
		res.status(200).json({ carlist: carlist });
	} catch (error) {
		res.status(500).json({
			message: 'Error fetching new cars',
			error: error.message
		});
	}
});

app.get('/usedcars/cars', async function (req, res) {
	try {
		const usedCars = db.collection('usedcars');
		const carlist = await usedCars.find({})  // Removed the status filter
			.sort({ createdAt: 1 })
			.toArray();
		res.status(200).json({ carlist: carlist });
	} catch (error) {
		res.status(500).json({
			message: 'Error fetching used cars',
			error: error.message
		});
	}
});

// Get user details
app.get('/dashboard', authenticateToken, async (req, res) => {
	try {
		const User = db.collection('user');
		const user = await User.findOne({ email: req.query.email });
		// console.log(user);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get user's cars
app.get('/dashboard/cars', async (req, res) => {
	try {
		const Car = db.collection('usedcars');
		const newCar = db.collection('newcars');
		const auction = db.collection('auction');
		const usedCars = await Car.find({ email: req.query.email }).toArray();
		const newCars = await newCar.find({ email: req.query.email }).toArray();
		const auctionCars = await auction.find({ email: req.query.email }).toArray();
		res.json({ usedCars: usedCars, newCars: newCars, auctionCars: auctionCars });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get liked cars
app.get('/dashboard/liked-cars', async (req, res) => {
	try {
		const User = db.collection('user');
		const user = await User.findOne({ email: req.query.email });
		res.json(user.likedCars || []);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Delete user account
app.delete('/dashboard/user/:id', authenticateToken, async (req, res) => {
	try {
		const id = req.params.id;
		const User = db.collection('user');
		const user = await User.findOne({ _id: new ObjectId(id) });

		await User.findOneAndDelete({ _id: new ObjectId(id) });
		const newcars = await db.collection('newcars').findOne({ userid: new ObjectId(id) });
		const usedcars = await db.collection('usedcars').findOne({ userid: new ObjectId(id) });
		const auction = await db.collection('auction').findOne({ userid: new ObjectId(id) });
		if (newcars) {
			await fsPromises.unlink(path.join(__dirname, '..', 'uploads', newcars.image));
			await db.collection('newcars').deleteMany({ userid: new ObjectId(id) });
		}
		if (usedcars) {
			await fsPromises.unlink(path.join(__dirname, '..', 'uploads', usedcars.image));
			await db.collection('usedcars').deleteMany({ userid: new ObjectId(id) });
		}
		if (auction) {
			await fsPromises.unlink(path.join(__dirname, '..', 'uploads', auction.image));
			await db.collection('auction').deleteMany({ userid: new ObjectId(id) });
		}
		await db.collection('reviews').deleteMany({ reviewerEmail: req.query.email });
		await db.collection('testdrive').deleteMany({ email: req.query.email });
		if (user.dealerStatus === 'verified') {
			await fsPromises.unlink(path.join(__dirname, '..', 'uploads', user.dealerDocument));
		}
		res.json({ message: 'User deleted successfully' });

	} catch (error) {
		res.status(500).json({ message: error.message });
	}

});

app.get('/dashboard/update', authenticateToken, async (req, res) => {
	try {
		const User = db.collection('user');
		const user = await User.findOne({ email: req.query.email });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.put('/dashboard/update_user', authenticateToken, async (req, res) => {
	try {
		const { email, phone, username, currentPassword, newPassword } = req.body;
		const User = db.collection('user');
		const newCar = db.collection('newcars');
		const usedCar = db.collection('usedcars');
		const auction = db.collection('auction');
		const id = String(req.body.id);
		const user = await User.findOne({ _id: new ObjectId(id) });

		// If password change is requested, verify current password
		if (currentPassword && newPassword) {
			const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
			if (!isPasswordValid) {
				return res.status(400).json({ message: 'Current password is incorrect' });
			}
			// Hash new password
			const hashedPassword = await bcrypt.hash(newPassword, 10);
			// Update user with new password
			await User.updateOne(
				{ _id: user._id },
				{
					$set: {
						email,
						username,
						phone,
						password: hashedPassword
					}
				}
			);
		} else {

			await User.updateOne(
				{ _id: user._id },
				{
					$set: {
						email,
						username,
						phone
					}
				}
			);

		}
		await newCar.updateOne({ userid: user._id }, { $set: { email, sellerName: username } });
		await usedCar.updateOne({ userid: user._id }, { $set: { email, sellerName: username } });
		await auction.updateOne({ userid: user._id }, { $set: { email, sellerName: username } });

		res.json({ message: 'User details updated successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get car by ID from specific collection
app.get('/dashboard/editcar/:collection/:id', authenticateToken, async (req, res) => {
	try {
		const { collection, id } = req.params;
		const db_collection = db.collection(collection);
		const car = await db_collection.findOne({ _id: new ObjectId(id) });

		if (!car) {
			return res.status(404).json({ message: 'Car not found' });
		}

		res.json(car);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Update car in specific collection
app.put('/dashboard/cars/:collection/update/:id', authenticateToken, async (req, res) => {
	try {
		const { collection, id } = req.params;
		const updates = { ...req.body };
		delete updates._id;
		delete updates.userid;

		const db_collection = db.collection(collection);
		const car = await db_collection.findOne({ _id: new ObjectId(id) });

		// Convert string numbers to actual numbers
		if (updates.year) updates.year = Number(updates.year);
		if (updates.price) updates.price = Number(updates.price);
		if (updates.mileage) updates.mileage = Number(updates.mileage);
		if (updates.minimumBid) updates.minimumBid = Number(updates.minimumBid);
		if (updates.auctionDuration) updates.auctionDuration = Number(updates.auctionDuration);

		const result = await db_collection.updateOne(
			{ _id: car._id },
			{ $set: updates }
		);

		if (result.matchedCount === 0) {
			return res.status(404).json({ message: 'Car not found' });
		}

		res.json({ message: 'Car updated successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.delete('/dashboard/deletecar/:collection/:id', authenticateToken, async (req, res) => {
	try {
		const id = req.params.id;
		const collection = req.params.collection;
		const db_collection = db.collection(collection);
		const car = await db_collection.findOne({ _id: new ObjectId(id) });
		const imagePath = path.join(__dirname, '..', 'uploads', car.image);
		await db_collection.deleteOne({ _id: car._id });
		await fsPromises.unlink(imagePath);
		res.json({ message: 'Car deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get car details by ID for specific collection
app.get('/:collection/car/:id', async (req, res) => {
	try {
		const { collection, id } = req.params;
		const db_collection = db.collection(collection);
		const car = await db_collection.findOne({ _id: new ObjectId(id) });

		if (!car) {
			return res.status(404).json({ message: 'Car not found' });
		}

		res.json(car);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get user details by ID
app.get('/user/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const User = db.collection('user');
		const user = await User.findOne({ _id: new ObjectId(id) });

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Remove sensitive information
		const { password, ...userDetails } = user;
		res.json(userDetails);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Add review
app.post('/:collection/review/:id', authenticateToken, async (req, res) => {
	try {
		const { collection, id } = req.params;
		const { rating, image, comment, reviewerName, reviewerEmail, carName } = req.body;

		const review = {
			carId: new ObjectId(id),
			carName,
			collection,
			image,
			rating: Number(rating),
			comment,
			reviewerName,
			reviewerEmail,
			createdAt: new Date()
		};

		const reviews = db.collection('reviews');
		await reviews.insertOne(review);

		res.status(201).json({ message: 'Review added successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get reviews for a car
app.get('/:collection/reviews/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const reviews = db.collection('reviews');
		const carReviews = await reviews.find({
			carId: new ObjectId(id)
		})
			.sort({ createdAt: -1 })
			.toArray();

		res.json(carReviews);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get last reviews from each collection
app.get('/reviews', async (req, res) => {
	try {

		const reviews = db.collection('reviews');
		const recentReviews = await reviews.find({})
			.sort({ createdAt: -1 })
			.limit(3)
			.toArray();

		res.json(recentReviews);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get user's reviews
app.get('/dashboard/user-reviews', authenticateToken, async (req, res) => {
	try {
		const reviews = db.collection('reviews');
		const userReviews = await reviews.find({
			reviewerEmail: req.query.email
		})
			.sort({ createdAt: -1 })
			.toArray();

		res.json(userReviews);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
app.get('/dashboard/editreview/:id', authenticateToken, async (req, res) => {
	try {
		const id = req.params.id;
		const reviews = db.collection('reviews');
		const review = await reviews.findOne({ _id: new ObjectId(id) });
		res.json(review);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
app.delete('/dashboard/deletereview/:id', authenticateToken, async (req, res) => {
	try {
		const id = req.params.id;
		const reviews = db.collection('reviews');
		await reviews.deleteOne({ _id: new ObjectId(id) });
		res.json({ message: 'Review deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Update review
app.put('/dashboard/updatereview/:id', authenticateToken, async (req, res) => {
	try {
		const { id } = req.params;
		const { rating, comment } = req.body;
		const reviews = db.collection('reviews');

		await reviews.updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					rating: Number(rating),
					comment,
					updatedAt: new Date()
				}
			}
		);

		res.json({ message: 'Review updated successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.get('/:collection/testdrive/:id', async (req, res) => {
	try {
		const { collection, id } = req.params;
		const db_collection = db.collection(collection);
		const car = await db_collection.findOne({ _id: new ObjectId(id) });
		res.json(car);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.post('/:collection/testdrive/request/:id', authenticateToken, async (req, res) => {
	try {
		const { collection, id } = req.params;
		const { email, name, phone, date } = req.body;
		const testdrive = db.collection('testdrive');
		await testdrive.insertOne({
			email,
			name,
			phone,
			date,
			carId: new ObjectId(id),
			collection
		});
		res.json({ message: 'Test drive request submitted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Search endpoints for each collection
app.get('/newcars/search', async (req, res) => {
	try {
		const { make, model, year, price } = req.query;
		const query = {};

		if (make) query.make = new RegExp(make, 'i');
		if (model) query.model = new RegExp(model, 'i');
		if (year) query.year = parseInt(year);
		if (price) query.price = { $lte: parseInt(price) };

		const newCars = db.collection('newcars');
		const results = await newCars.find(query).toArray();
		res.json(results);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.get('/usedcars/search', async (req, res) => {
	try {
		const { make, model, year, price } = req.query;
		const query = {};

		if (make) query.make = new RegExp(make, 'i');
		if (model) query.model = new RegExp(model, 'i');
		if (year) query.year = parseInt(year);
		if (price) query.price = { $lte: parseInt(price) };

		const usedCars = db.collection('usedcars');
		const results = await usedCars.find(query).toArray();
		res.json(results);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.get('/auction/search', async (req, res) => {
	try {
		const { make, model, year, price } = req.query;
		const query = { status: 'active' };

		if (make) query.make = new RegExp(make, 'i');
		if (model) query.model = new RegExp(model, 'i');
		if (year) query.year = parseInt(year);
		if (price) query.currentBid = { $lte: parseInt(price) };

		const auction = db.collection('auction');
		const results = await auction.find(query).toArray();
		res.json(results);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.get('/:collection/similar/:id', async (req, res) => {
	try {
		const { collection, id } = req.params;
		const db_collection = db.collection(collection);

		// First get the current car details
		const currentCar = await db_collection.findOne({ _id: new ObjectId(id) });
		if (!currentCar) {
			return res.status(404).json({ message: 'Car not found' });
		}

		// Find similar cars based on make and type
		const similarCars = await db_collection.find({
			$and: [
				{ _id: { $ne: new ObjectId(id) } }, // Exclude current car
				{
					$or: [
						{ make: currentCar.make },
						{ type: currentCar.type }
					]
				}
			]
		}).limit(3).toArray();

		// If we don't have enough cars from the same collection, get from others
		if (similarCars.length < 3) {
			const otherCollections = ['newcars', 'usedcars', 'auction'].filter(c => c !== collection);
			const remainingCount = 3 - similarCars.length;

			const additionalCars = await Promise.all(otherCollections.map(async (coll) => {
				const coll_db = db.collection(coll);
				return await coll_db.find({
					$or: [
						{ make: currentCar.make },
						{ type: currentCar.type }
					]
				}).limit(remainingCount).toArray();
			}));

			// Flatten and add collection info
			const flatAdditionalCars = additionalCars.flat().map(car => ({
				...car,
				fromCollection: true
			}));

			similarCars.push(...flatAdditionalCars.slice(0, remainingCount));
		}

		res.json(similarCars);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
app.get('/dashboard/dealer-status', authenticateToken, async (req, res) => {
	try {
		const User = db.collection('user');
		const user = await User.findOne({ email: req.query.email });
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
app.post('/dashboard/dealer-certification', authenticateToken, documentUpload.single('document'), async (req, res) => {
	try {
		const { address, document } = req.body;
		const User = db.collection('user');
		await User.updateOne({ email: req.query.email }, { $set: { dealerStatus: 'verified', dealerAddress: address, dealerDocument: document } });
		res.json({ message: 'Dealer certification submitted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.listen(8080, () => console.log("server running"));

