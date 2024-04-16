const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const fs = require('fs');
const csv = require('csv-parser');
const router = express.Router();

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const User = require('./models/User');
const Appointment = require('./models/appointments');
const appointments = require('./models/appointments');

mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });
const doctorsArray = [ {"model": "doctor_profile.profile",
"pk": 2,
"fields": {
  "doctor_id": "skg1",
  "profile_photo": "images/doctor2.jpg",
  "first_name": "Shivam",
  "last_name": "Gupta",
  "gender": "Male",
  "email_id": "shivam.g17@iiits.in",
  "mobile_no": 9411329082,
  "speciality": "ENT",
  "qualification": "MBBS, MD",
  "locality": "Haridwar",
  "hospital": "Central Hospital"
}
},
{
"model": "doctor_profile.profile",
"pk": 3,
"fields": {
  "doctor_id": "mishra",
  "profile_photo": "images/doctor3.jpg",
  "first_name": "Ajay",
  "last_name": "Mishra",
  "gender": "male",
  "email_id": "ajay.m17@iiits.in",
  "mobile_no": 9411329082,
  "speciality": "Heart Specialist",
  "qualification": "MBBS MD",
  "locality": "Sri city",
  "hospital": "Sindhi Hospital"
}
},
{
"model": "doctor_profile.profile",
"pk": 4,
"fields": {
  "doctor_id": "aman_kumar",
  "profile_photo": "images/doctor4.jpg",
  "first_name": "Aman",
  "last_name": "Kumar",
  "gender": "Male",
  "email_id": "aman.k17",
  "mobile_no": 9411329082,
  "speciality": "ENT",
  "qualification": "MBBS MD",
  "locality": "Sri City",
  "hospital": "Sharda Hospital"
}
},
{
"model": "doctor_profile.profile",
"pk": 5,
"fields": {
  "doctor_id": "aman_gupta",
  "profile_photo": "images/doctor5.jpg",
  "first_name": "Aman",
  "last_name": "Gupta",
  "gender": "Male",
  "email_id": "aman.g17@iiits.in",
  "mobile_no": 9411329082,
  "speciality": "Gynaceologist",
  "qualification": "MBBS BDS",
  "locality": "Chennai",
  "hospital": "Apollo Hospital"
}
},
{
"model": "doctor_profile.profile",
"pk": 6,
"fields": {
  "doctor_id": "aman_gupta1",
  "profile_photo": "images/doctor6.jpg",
  "first_name": "Aman",
  "last_name": "Gupta",
  "gender": "Male",
  "email_id": "aman.g17@iiits.in",
  "mobile_no": 9411329082,
  "speciality": "Gynaceologist",
  "qualification": "MBBS BDS",
  "locality": "Chennai",
  "hospital": "Apollo Hospital"
}
},
{
"model": "doctor_profile.profile",
"pk": 7,
"fields": {
  "doctor_id": "skg2",
  "profile_photo": "images/doctor7.jpg",
  "first_name": "Shivam",
  "last_name": "Gupta",
  "gender": "Male",
  "email_id": "shivam.g17@iiits.in",
  "mobile_no": 9411329082,
  "speciality": "EYE SPECIALIST",
  "qualification": "MBBS MD",
  "locality": "Chennai",
  "hospital": "Ashtha Hospital"
}
},
{
"model": "doctor_profile.profile",
"pk": 8,
"fields": {
  "doctor_id": "skg3",
  "profile_photo": "images/doctor8.jpg",
  "first_name": "Shivam",
  "last_name": "Gupta",
  "gender": "Male",
  "email_id": "shivam.g17@iiits.in",
  "mobile_no": 9411329082,
  "speciality": "ENT",
  "qualification": "MBBS MD",
  "locality": "NOIDA",
  "hospital": "Max Hospital"
}
},
{
"model": "doctor_profile.profile",
"pk": 9,
"fields": {
  "doctor_id": "skg4",
  "profile_photo": "images/doctor9.jpg",
  "first_name": "Aditi",
  "last_name": "Gupta",
  "gender": "Male",
  "email_id": "shivam.g17@iiits.in",
  "mobile_no": 9411329082,
  "speciality": "Gynaceologist",
  "qualification": "MBBS MD",
  "locality": "Chennai",
  "hospital": "Naveen Hospital"
}
}
] 
app.get('/',(req,res)=>{
    res.render('patient_login.ejs');
})
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

//LOGIN
app.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            //session data
            req.session.user = {
                id: user._id,
                username: user.username,
                email: user.email
            };
            res.redirect('/dashboard'); 
        } else {
            res.redirect('/?error=login_failed');
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.redirect('/?error=login_failed'); 
    }
});

const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/?error=unauthorized');
    }
};
//protected 
app.get('/dashboard', requireAuth, (req, res) => {
    if(req.session && req.session.user){
        res.render('dashboard.ejs', { username: req.session.user.username });
    }
});

//Logout 
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/register',(req,res)=>{
    res.render('patient_register.ejs');
})
app.post('/register',async (req,res)=>{
    const {username,password,email} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        password:hashedPassword,
        email
    });
    try {
        
        const savedUser = await newUser.save();
        console.log('User registered:', savedUser);
        res.redirect('/register'); 
    } catch (error) {
        console.error('Error registering user:', error);
        res.redirect('/register?error=registration_failed'); 
    }
})
function readCSV(filePath) {
    const data = [];
    const file = fs.readFileSync(filePath, 'utf-8').split('\n');
    file.forEach(row => {
        const cleanedRow = row.split(',').map(cell => cell.trim()).filter(cell => cell !== '');
        if (cleanedRow.length > 0) {
            data.push(cleanedRow);
        }
    });
    return data;
}
function findMatchingDiseases(dataset, symptomsToFind) {
    const matchingDiseases = [];
    dataset.forEach(row => {
        if (row.slice(1).join(',') === symptomsToFind.join(',')) {
            matchingDiseases.push(row[0]);
        }
    });
    return matchingDiseases;
}

const csvFilePath = 'data/dataset.csv';

let dataset = readCSV(csvFilePath);
dataset = dataset.map(row => row.filter(value => value !== ''));


let diagnosedDisease = null;
app.get('/diagnosis',(req,res)=>{
    res.render('getDiagnosis.ejs');
})
let diseaseDescription = '';
let diseasePrecaution = [];
app.post('/diagnosis',(req,res)=>{
    const {symptom1,symptom2, symptom3, symptom4, symptom5} = req.body;
    const symptomsToFind = [symptom1,symptom2,symptom3];
    if(symptom4){
        symptomsToFind.push(symptom4);
    }
    if(symptom5){
        symptomsToFind.push(symptom5);
    }
    const matchingDiseases = findMatchingDiseases(dataset, symptomsToFind);
    if (matchingDiseases.length===0){
        diagnosedDisease='';
    }
    else{
        diagnosedDisease=matchingDiseases[0];    
    }
    res.redirect('/diagnosed')
    fs.createReadStream('data/symptom_Description.csv')
    .pipe(csv())
    .on('data', (row) => {
      if (row.Disease === diagnosedDisease) {
        diseaseDescription = row.Description;
      }
    });
    diseasePrecaution.splice(0);
    fs.createReadStream('data/symptom_precaution.csv')
    .pipe(csv())
    .on('data', (row) => {
      
      if (row.Disease === diagnosedDisease) {
        diseasePrecaution.push(row.Precaution_1);
        diseasePrecaution.push(row.Precaution_2);
        diseasePrecaution.push(row.Precaution_3);
        diseasePrecaution.push(row.Precaution_4);
      }
    });
})

app.get('/diagnosed',(req,res)=>{
    res.render('diagnosis.ejs',{
        disease:diagnosedDisease,
        description:diseaseDescription,
        precaution:diseasePrecaution,
    })
})
app.get('/doctors',(req,res)=>{
    res.render('doctors.ejs',{
        doctors:doctorsArray,
    })
})
app.get('/doctors/:doctorId/book-appointment', (req, res) => {
    const { doctorId } = req.params;
    const doctor = doctorsArray.find(doc => doc.fields.doctor_id === doctorId);
    if (!doctor) {
        res.status(404).send('Doctor not found');
        return;
    }
    const doctorName = `${doctor.fields.first_name} ${doctor.fields.last_name}`;
    res.render('bookAppointment', { doctor });
});

// Route to handle appointment booking
app.post('/doctors/:doctorId/book-appointment', async (req, res) => {
    const { doctorId } = req.params;
    const { appointmentDate } = req.body;
    
    try {
        const doctor = doctorsArray.find(doc => doc.fields.doctor_id === doctorId);
        let doctorName = doctor.fields.first_name+doctor.fields.last_name;
        const appointment = new Appointment({
            doctorName,
            appointmentDate
        });
        await appointment.save();
        res.redirect('/appointmentSuccess');
    } catch (error) {
        console.error('Error saving appointment:', error);
        res.status(500).send('Error saving appointment');
    }
});
app.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.render('appointments', { appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Error fetching appointments');
    }
});
app.get('/appointmentSuccess',(req,res)=>{
    res.render('appointmentSuccess.ejs');
})
app.listen(3000,()=>{
    console.log('app started on port 3000');
})