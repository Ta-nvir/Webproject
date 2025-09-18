const db = require('./dbconfig')
const path = require('path')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const moment = require('moment')
const cors = require('cors')
const bcrypt = require('bcrypt')
const express = require('express')
const fs = require('fs');

const app = express()

//middlewares
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const saltrounds = 10
let scretkey = "sportsclubelite"

const uploadDir = path.join(__dirname, 'uploads', 'EmpImages');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/EmpImages/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}_${Math.round(Math.random() * 1E9)}${ext}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });





const workStatusStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/WorkStatusImages/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}_${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

const uploadWorkStatusImage = multer({ storage: workStatusStorage });



app.post('/addMaids', upload.single('profile'), (req, res) => {
    const {
        name,
        age,
        gender,
        phone,
        experience,
        cityid,
        areaid,
        categoryid,
        description,
        emailid,
        password
    } = req.body;

    if (!name || !cityid || !areaid) {
        return res.status(400).json({ message: 'Name, city and area are required.' });
    }

    const profilePath = req.file ? req.file.filename : null;

    const sql = `INSERT INTO Emps 
    (name, age, gender, phone, experience, cityid, areaid,categoryid, profile, description,emailid,password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?,?,?)`;

    const values = [name, age, gender, phone, experience, cityid, areaid,categoryid, profilePath, description, emailid, password];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Insert error:', err);
            return res.status(500).json({ message: 'Database error.' });
        }

        res.status(200).json({ message: 'Maid added successfully.' });
    });
});

// GET all employees with related city, area, and category info
app.get('/employees', (req, res) => {
  const sql = `
    SELECT 
      e.empid, e.name, e.age, e.gender, e.phone, e.experience, e.profile,
      e.description, e.created_at, e.emailid, e.role,
      c.city_name, a.areaname, cat.categoryname
    FROM emps e
    INNER JOIN city c ON e.cityid = c.city_id
    INNER JOIN area a ON e.areaid = a.areaid
    INNER JOIN category cat ON e.categoryid = cat.categoryid
    ORDER BY e.empid DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
});

// PUT update employee
app.put('/employee/:empid', (req, res) => {
  const empid = req.params.empid;
  const {
    name, age, gender, phone, experience,
    cityid, areaid, description, emailid, password, role, categoryid
  } = req.body;

  const sql = `
    UPDATE emps 
    SET name = ?, age = ?, gender = ?, phone = ?, experience = ?, 
        cityid = ?, areaid = ?, description = ?, 
        emailid = ?, password = ?, role = ?, categoryid = ?
    WHERE empid = ?
  `;

  const values = [
    name, age, gender, phone, experience,
    cityid, areaid, description, emailid, password, role, categoryid, empid
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ message: 'Update failed', error: err });
    res.json({ message: 'Employee updated successfully' });
  });
});

// DELETE employee
app.delete('/employee/:empid', (req, res) => {
  const empid = req.params.empid;

  const sql = `DELETE FROM emps WHERE empid = ?`;

  db.query(sql, [empid], (err, result) => {
    if (err) return res.status(500).json({ message: 'Delete failed', error: err });
    res.json({ message: 'Employee deleted successfully' });
  });
});



app.post('/api/cities', (req, res) => {
    const { city_name } = req.body;

    // Check if the city already exists
    const checkQuery = "SELECT * FROM city WHERE city_name = ?";

    db.query(checkQuery, [city_name], (err, result) => {
        if (err) {
            console.error('Error checking city existence:', err);
            return res.status(500).json({ success: false, message: "Failed to check city" });
        }

        // If city exists, return a message
        if (result.length > 0) {
            return res.status(400).json({ success: false, message: "City already exists" });
        }

        // Otherwise, insert the new city
        const insertQuery = "INSERT INTO city (city_name) VALUES (?)";

        db.query(insertQuery, [city_name], (err, result) => {
            if (err) {
                console.error('Error inserting city:', err);
                return res.status(500).json({ success: false, message: "Failed to insert city" });
            }
            res.json({ success: true, message: "City added successfully", city_id: result.insertId });
        });
    });
});

// Update city by ID
app.put('/api/cities/:cityId', (req, res) => {
    const { cityId } = req.params;
    const { city_name } = req.body;

    const query = "UPDATE city SET city_name = ? WHERE city_id = ?";

    db.query(query, [city_name, cityId], (err, result) => {
        if (err) {
            console.error('Error updating city:', err);
            return res.status(500).json({ success: false, message: "Failed to update city" });
        }
        res.json({ success: true, message: "City updated successfully" });
    });
});

// Delete city by ID
app.delete('/api/cities/:cityId', (req, res) => {
    const { cityId } = req.params;

    const query = "DELETE FROM city WHERE city_id = ?";

    db.query(query, [cityId], (err, result) => {
        if (err) {
            console.error('Error deleting city:', err);
            return res.status(500).json({ success: false, message: "Failed to delete city" });
        }
        res.json({ success: true, message: "City deleted successfully" });
    });
});


//city list
app.get('/citylist', (req, res) => {
    const sqlQuery = "select * from city";
    db.query(sqlQuery, (err, result) => {
        console.log(err)
        console.log(result)
        if (err) return res.status(500).json("DataBase Issue")
        else return res.status(200).json(result)

    })

});


// POST /api/areas
app.post('/api/areas', async (req, res) => {
    const { cityid, areaname } = req.body;

    if (!cityid || !areaname) {
        return res.status(400).json({ message: 'City and area name are required.' });
    }


    db.query('INSERT INTO area (cityid, areaname) VALUES (?, ?)', [cityid, areaname], (err) => {
        if (err) return res.status(500).json({ message: 'City and area name are required.' });
        else {
            res.status(201).json({ message: 'Area added successfully.' });
        }
    });


});

app.post('/maidcategory', (req, res) => {
    const { categoryname } = req.body;

    if (!categoryname || categoryname.trim().length < 3) {
        return res.status(400).json({ message: 'Category name must be at least 3 characters long.' });
    }

    const sql = 'INSERT INTO category (categoryname) VALUES (?)';
    db.query(sql, [categoryname.trim()], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Category already exists.' });
            }
            console.error('Insert error:', err);
            return res.status(500).json({ message: 'Database error while inserting category.' });
        }

        res.status(201).json({ message: 'Category added successfully', categoryid: result.insertId });
    });
});

app.get('/maidcategory', (req, res) => {
    const sql = 'SELECT * FROM category ORDER BY categoryname ASC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching categories.' });
        res.json(results);
    });
});

// UPDATE Category
app.put('/maidcategory/:id', (req, res) => {
    const { id } = req.params;
    const { categoryname } = req.body;

    if (!categoryname || categoryname.trim().length < 3) {
        return res.status(400).json({ message: 'Category name must be at least 3 characters long.' });
    }

    const sql = 'UPDATE category SET categoryname = ? WHERE categoryid = ?';
    db.query(sql, [categoryname.trim(), id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error updating category.' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found.' });
        res.json({ message: 'Category updated successfully.' });
    });
});

// DELETE Category
app.delete('/maidcategory/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM category WHERE categoryid = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error deleting category.' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found.' });
        res.json({ message: 'Category deleted successfully.' });
    });
});

// Get Cities
app.get('/api/cities', (req, res) => {
    db.query('SELECT * FROM city', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching cities' });
        res.json(results);
    });
});

app.get('/maidProfile', (req, res) => {
    let sqlQuery = `SELECT 
e.empid, e.name, e.age,
e.gender, e.phone, e.experience, e.cityid,e.categoryid,ct.categoryname,
e.areaid, e.profile, e.description, 
e.emailid, e.password, e.role, c.city_name,
a.areaname FROM emps as e
inner join city c on c.city_id= e.cityid
inner join area a on a.areaid=e.areaid
inner join category as ct on e.categoryid=ct.categoryid;`

    db.query(sqlQuery, (err, result) => {
        if (err) return res.status(500).json("DataBase Issue")
        else return res.status(200).json(result)
    })

})


//user register
app.post('/register', (req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;

    // Check if the email already exists in the database
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (result.length > 0) {
            // If email exists, send an error response
            return res.status(400).json({ message: 'Email already exists' });
        }

        // If email doesn't exist, proceed with user registration
        const insertQuery = 'INSERT INTO users (firstname, lastname, email, phone, password) VALUES (?, ?, ?, ?, ?)';
        db.query(insertQuery, [firstname, lastname, email, phone, password], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to register user', error: err });
            }

            return res.status(200).json({ message: 'User registered successfully' });
        });
    });
});


// Get Areas by City
app.get('/api/areas/:cityid', (req, res) => {
    const { cityid } = req.params;
    db.query('SELECT * FROM area WHERE cityid = ?', [cityid], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching areas' });
        res.json(results);
    });
});




let genratetoekn = (userid, userrole) => {
    return jwt.sign({ userid, userrole }, scretkey, { expiresIn: '1h' })
}
const authorizeRoles = roles => async (req, res, next) => {
    console.log(req.user)
    if (!roles.includes(req.user.userrole)) return res.status(403).json({ error: "Access Denied" })
    next()
}
const verifyToken = async (req, res, next) => {
      
    let token = req.headers.authorization.split(" ")[1]
    console.log(token)
    if (!token) return res.status(401).json({ error: "Unauthorized" })

    jwt.verify(token, scretkey, (err, decode) => {
        console.log(err)
        if (err) return res.status(403).json({ error: "Invalid Token" })
        else {
            req.user = decode
            console.log(req.user)
            next()
        }
    })
}
//userlogin
app.post('/userLogin', async (req, res) => {
    let { emailid, password } = req.body
    console.log(req.body)
    let sqlQuery = "select * from  users where email=? and password=?"
    db.query(sqlQuery, [emailid, password], async (err, result) => {
        console.log("result", result)
        if (err) {
            console.log(err)
            return res.status(500).json({ message: "DataBase Error" })
        }
        if (result.length == 0) return res.status(404).json({ message: "User Not Found" })
        else {
            let user = result[0]



            let token = genratetoekn(user.userid, user.role)
            console.log("token", token)


            res.status(200).json({ token, role: user.role });

        }

    })

})

app.post('/admiLogin', async (req, res) => {
    let { email, password } = req.body

    let sqlQuery = "select * from  tbladmin where email=? and password=?"
    db.query(sqlQuery, [email, password], async (err, result) => {
        if (err) return res.status(500).json({ message: "DataBase Error" })
        if (result.length == 0) return res.status(404).json({ message: "User Not Found or Invalid Pasword" })
        else {
            let user = result[0]


            let token = genratetoekn(user.adminid, user.role)
            console.log("token", token)



            res.status(200).json({ token, role: user.role });

        }

    })

})

app.post('/empLogin', async (req, res) => {
    let { emailid, password } = req.body
    console.log(req.body)
    let sqlQuery = "select * from  emps where emailid=? and password=?"
    db.query(sqlQuery, [emailid, password], async (err, result) => {
        console.log("result", result)
        if (err) {
            console.log(err)
            return res.status(500).json({ message: "DataBase Error" })
        }
        if (result.length == 0) return res.status(404).json({ message: "User Not Found" })
        else {
            let user = result[0]



            let token = genratetoekn(user.empid, user.role)
            console.log("token", token)


            res.status(200).json({ token, role: user.role });

        }

    })

})





//Save User
app.post('/userRegister', (req, res) => {
    const { firstname, lastname, cityid, mobile, emailid, password } = req.body
    const existingUser = "select * from users where  emailid=?"

    // findexiting user
    db.query(existingUser, [emailid], async (err, result) => {
        if (result.length > 0) {
            return res.status(400).json({ message: "User Already Exist" })
        }
        else {
            const sqlQuery = "INSERT INTO users ( firstname, lastname, cityid, mobile, emailid, password) VALUES (?, ?, ?, ?, ?,?)";

            bcrypt.hash(password, saltrounds, (err, hash) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "Hashing Error" });
                }

                db.query(sqlQuery, [firstname, lastname, cityid, mobile, emailid, hash], (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: "Database Error" });
                    }



                    return res.status(200).json({ message: " Landlord Registered Successfully" });
                });
            });
        }


    })


})



app.get('/userDetails', (req, res) => {
    const sqlQuery = "select u.userid, u.firstname, u.lastname, u.mobile, u.emailid, u.password, u.role, c.city_id, c.city_name from users as u inner join city as c on u.cityid=c.city_id;";
    db.query(sqlQuery, (err, result) => {
        if (err) return res.status(500).json("DataBase Issue")
        else return res.status(200).json(result)
    })
})
app.put('/userDetails/:id', (req, res) => {
    const { firstname, lastname, cityid, mobile, emailid } = req.body;
    const query = `
      UPDATE users SET firstname = ?, lastname = ?, cityid = ?, mobile = ?, emailid = ?
      WHERE userid = ?
    `;
    db.query(query, [firstname, lastname, cityid, mobile, emailid, req.params.id], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({ error: 'Update failed' });
        }
        else res.json({ message: 'User updated successfully' });
    });
});

// DELETE: Delete User
app.delete('/userDetails/:id', (req, res) => {
    const query = `DELETE FROM user WHERE userid = ?`;
    db.query(query, [req.params.id], (err, result) => {
        if (err) res.status(500).json({ error: 'Delete failed' });
        else res.json({ message: 'User deleted successfully' });
    });
});




app.post("/requestMaid", verifyToken, authorizeRoles(["user"]), (req, res) => {
    const { maidid, description } = req.body;
    const userid = req.user.userid;
    console.log(userid)
    let sqlQuery = "INSERT INTO maidrequest (userid, empid, Description) VALUES (?, ?, ?)"
    db.query(sqlQuery, [userid, maidid, description], (err) => {
        console.log(err)
        if (err) res.status(500).json({ message: "DataBase Error" })
        else res.status(200).json({ message: "Request saved successfully" });
    }
    );


});

app.get('/requesttoAdmin', (req, res) => {
    let sqlQuery = `	SELECT mr.requestid,mr.status, u.firstname,u.lastname,u.email,u.phone as userMobile,
    e.name,e.phone,mr.Description,mr.Fees
    FROM maidrequest as mr 
	inner join users as u on mr.userid=u.userid
	inner join emps as e on mr.empid=e.empid;`

    db.query(sqlQuery, (err, result) => {
        if (err) res.status(500).json({ message: "DataBase Error" })
        else res.status(200).json(result);
    })

})



// avialable not avilabel update 
app.post('/updaterequeststatus', (req, res) => {
    const { requestid, status, fees } = req.body;
    let sql;
    let params;

    if (fees !== undefined && status === 'Available') {
        sql = 'UPDATE maidrequest SET status = ?, fees = ? WHERE requestid = ?';
        params = [status, fees, requestid];
    } else {
        sql = 'UPDATE maidrequest SET status = ?,fees=0 WHERE requestid = ?';
        params = [status, requestid];
    }

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).send('Database Error');
        res.send('Status updated');
    });
});


app.get('/selectedWork',verifyToken,authorizeRoles(["emp"]), (req, res) => {
    let empId=req.user.empid
    let sqlQuery = `SELECT mr.requestid,mr.status,mr.empid, u.firstname,u.lastname,u.email,u.phone as userMobile,
    e.name,e.phone,mr.Description,mr.fees
    FROM maidrequest as mr 
	inner join users as u on mr.userid=u.userid
	inner join emps as e on mr.empid=e.empid where mr.status="Available" and mr.empid=?`
    db.query(sqlQuery,[empId], (err,result) => {
        if (err) res.status(500).json({ message: "DataBase Error" })
        else res.status(200).json(result);
    })
})


app.get('/myWorks',verifyToken,authorizeRoles(["emp"]), (req, res) => {
    console.log("hello")
    console.log(req.user)
    let empId=req.user.userid
    console.log(empId)
    let sqlQuery = `SELECT mr.requestid,mr.status,mr.empid, u.firstname,u.lastname,u.email,u.phone as userMobile,
    e.name,e.phone,mr.Description,mr.Fees
    FROM maidrequest as mr 
	inner join users as u on mr.userid=u.userid
	inner join emps as e on mr.empid=e.empid where mr.status="booked" and mr.empid=?`
    db.query(sqlQuery,[empId], (err,result) => {
        console.log(result)
        if (err) res.status(500).json({ message: "DataBase Error" })
        else res.status(200).json(result);
    })
})

app.get('/completedWorks',verifyToken,authorizeRoles(["emp"]), (req, res) => {
    console.log("hello")
    console.log(req.user)
    let empId=req.user.userid
    console.log(empId)
    let sqlQuery = `SELECT mr.requestid,mr.status,mr.empid, u.firstname,u.lastname,u.email,u.phone as userMobile,
    e.name,e.phone,mr.Description,mr.Fees
    FROM maidrequest as mr 
	inner join users as u on mr.userid=u.userid
	inner join emps as e on mr.empid=e.empid where mr.status="Completed" and mr.empid=?`
    db.query(sqlQuery,[empId], (err,result) => {
        console.log(result)
        if (err) res.status(500).json({ message: "DataBase Error" })
        else res.status(200).json(result);
    })
})

//resuest update for user
app.get('/ReuqestStatusForUSers',verifyToken,authorizeRoles(["user"]), (req, res) => {
    let userId=req.user.userid;
    console.log(userId)
    let sqlQuery = `SELECT mr.requestid,mr.status,mr.empid, u.firstname,u.lastname,u.email,u.phone as userMobile,
    e.name,e.phone,mr.Description,mr.userid,mr.fees
    FROM maidrequest as mr 
	inner join users as u on mr.userid=u.userid
	inner join emps as e on mr.empid=e.empid
    where  mr.userid=?`
    db.query(sqlQuery,[userId], (err,result) => {
        if (err) res.status(500).json({ message: "DataBase Error" })
        else res.status(200).json(result);
    })
})




app.put('/payAndBook',(req, res) => {
  const { requestid } = req.body;

  db.query(
    'UPDATE maidrequest SET status = ? WHERE requestid = ?',
    ['booked', requestid],
    (err, result) => {
      if (err) {
        console.error('Payment error:', err);
        return res.status(500).json({ message: 'Error updating status' });
      }
      res.json({ message: 'Maid successfully booked!' });
    }
  );
});


//compliants
app.get('/compliants',verifyToken,authorizeRoles(["user"]), (req, res) => {
    let userId=req.user.userid;
    console.log(userId)
    let sqlQuery = `SELECT mr.requestid,mr.status,mr.empid, u.firstname,u.lastname,u.email,u.phone as userMobile,
    e.name,e.phone,mr.Description,mr.userid,mr.fees
    FROM maidrequest as mr 
	inner join users as u on mr.userid=u.userid
	inner join emps as e on mr.empid=e.empid
    where  mr.userid=? and status="booked" or status="Stop"`
    db.query(sqlQuery,[userId], (err,result) => {
        if (err) res.status(500).json({ message: "DataBase Error" })
        else res.status(200).json(result);
    })
})

app.post('/addFeedback',verifyToken,authorizeRoles(["user"]), (req, res) => {
  const { empid, requestid, feedback } = req.body;
  const userid = req.user.userid;
  console.log( empid, requestid, feedback)

  if (!empid || !requestid || !feedback) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `INSERT INTO feedback (userid, empid, requestid, feedback) VALUES (?, ?, ?, ?)`;

  db.query(sql, [userid, empid, requestid, feedback], (err, result) => {
    if (err) {
      console.error('Error inserting feedback:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'Feedback submitted successfully' });
  });
});

app.post('/submitwork',verifyToken,authorizeRoles(['emp']) ,uploadWorkStatusImage.single('image'), (req, res) => {
  const { description, workstatus, requestid } = req.body;
    console.log(req.body)
  if (!req.file) {
    return res.status(400).json({ message: 'Image is required' });
  }

  const imagePath = `/uploads/WorkStatusImages/${req.file.filename}`;
  const billNumber = `BILL-${Date.now()}`;

  // Insert into workstatus table
  const insertQuery = `
    INSERT INTO workstatus (imagepath, Description, Workstatuscol, requestid, Billnumber)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(insertQuery, [imagePath, description, workstatus, requestid, billNumber], (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ message: 'Failed to insert work status' });
    }

    // Update maidrequest table status to 'Completed'
    const updateQuery = `UPDATE maidrequest SET status = 'Completed' WHERE requestid = ?`;
    db.query(updateQuery, [requestid], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Update error:', updateErr);
        return res.status(500).json({ message: 'Failed to update request status' });
      }

      return res.status(200).json({ message: 'Work status saved and request marked as Completed', billNumber });
    });
  });
});


app.get('/detailstoadmin', (req, res) => {
  const sql = `
    SELECT 
      ws.statusid,
      ws.imagepath,
      ws.Description AS work_description,
      ws.Workstatuscol,
      ws.Billnumber,
      mr.requestid,
      mr.status AS request_status,
      mr.Fees,
      CONCAT(u.firstname, ' ', u.lastname) AS username,
      e.name AS empname
    FROM workstatus ws
    JOIN maidrequest mr ON ws.requestid = mr.requestid
    JOIN users u ON mr.userid = u.userid
    JOIN emps e ON mr.empid = e.empid
    ORDER BY ws.statusid DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching workstatus:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(result);
  });
});


app.get('/detailstoep',verifyToken,authorizeRoles(['emp']), (req, res) => {
    let empid=req.user.userid;
  const sql = `
    SELECT 
      ws.statusid,
      ws.imagepath,
      ws.Description AS work_description,
      ws.Workstatuscol,
      ws.Billnumber,
      mr.requestid,
      mr.status AS request_status,
      mr.Fees,
      CONCAT(u.firstname, ' ', u.lastname) AS username,
      e.name AS empname
    FROM workstatus ws 
    JOIN maidrequest mr ON ws.requestid = mr.requestid
    JOIN users u ON mr.userid = u.userid
    JOIN emps e ON mr.empid = e.empid where mr.empid=?
    ORDER BY ws.statusid DESC 
  `;

  db.query(sql,[empid], (err, result) => {
    if (err) {
      console.error('Error fetching workstatus:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(result);
  });
});



app.get('/detailstouser',verifyToken,authorizeRoles(['user']), (req, res) => {
    let empid=req.user.userid;
    console.log(empid)
  const sql = `
    SELECT 
      ws.statusid,
      ws.imagepath,
      ws.Description AS work_description,
      ws.Workstatuscol,
      ws.Billnumber,
      mr.requestid,
      mr.status AS request_status,
      mr.Fees,
      CONCAT(u.firstname, ' ', u.lastname) AS username,
      e.name AS empname
    FROM workstatus ws 
    JOIN maidrequest mr ON ws.requestid = mr.requestid
    JOIN users u ON mr.userid = u.userid
    JOIN emps e ON mr.empid = e.empid where mr.userid=?
    ORDER BY ws.statusid DESC 
  `;

  db.query(sql,[empid], (err, result) => {
    if (err) {
      console.error('Error fetching workstatus:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(result);
  });
});

app.put('/stopService',verifyToken,authorizeRoles(["user"]), (req, res) => {
  const { empid, requestid, feedback } = req.body;
  const userid = req.user.userid;
  console.log( empid, requestid, feedback)

  if (!empid || !requestid || !feedback) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `INSERT INTO feedback (userid, empid, requestid, feedback) VALUES (?, ?, ?, ?)`;

  db.query(sql, [userid, empid, requestid, feedback], (err, result) => {
    if (err) {
      console.error('Error inserting feedback:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    let sqlUpdate="update maidrequest set status=? where requestid=?"
    db.query(sqlUpdate,["Stop",requestid],(err)=>
    {
        if(err) return res.status(500).json({message:"Database Issue"})
            res.status(200).json({ message: 'Feedback submitted successfully' });
    })
   
  });
});










//   app.post('/api/estate', upload.array('images', 5), verifyToken, authorizeRoles(["Landlord"]), async (req, res) => {
//     try {
//       const landLordId = req.user.userid;

//       const { title, description, price, location, area_sqft, categoryid } = req.body;
//         const sqlQuery="INSERT INTO realestate (title, description, price, location, area_sqft, categoryid, lanlordid) VALUES (?, ?, ?, ?, ?, ?, ?)"
//         db.query(sqlQuery,[title, description, price, location, area_sqft, categoryid,landLordId],(err,result)=>
//         {
//                 if(err){console.log(err)
//                      return res.status(500).json({message:"Database Error"})}
//                 else {
//                     let estateid=result.insertId;
//                     const imagePaths = req.files.map(f => `/uploads/estates/${f.filename}`);
//                     const sqlForImageSave="INSERT INTO estate_images (estateid, image_url) VALUES (?, ?)";
//                     for (const img of imagePaths) {
//                          db.query(sqlForImageSave, [estateid, img],(err)=>
//                         {
//                             if(err) console.log(err)
//                             else    res.status(200).json({ message: 'Estate added successfully!' });
//                         });
//                       }
//                 }
//         })





//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });

app.listen(3000, (err) => {
    if (err) console.log(err)
    else console.log("PORT IS", 3000)
})