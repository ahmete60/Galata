/*  The HTTP method used to send the data: POST or GET:
 *  POST method should always be used if the data is going to result
 *    in a change to the server's database, because this can be made more
 *    resistant to cross-site forgery request attacks.
 *  GET method should only be used for forms that don't change user data
 *    (e.g. a search form). It is recommended for when you want to be
 *    able to bookmark or share the URL.
*/
var ddbSrvc               = require('../services/dbService');
const axios               = require('axios');
var express               = require('express');
var router                = express.Router();

const app    = require('../app');

/*
app.get('/search', function(req, res) {
    let query = req.query.queryStr;
    let url = `https://your.service.org?query=${query}`;

    axios({
        method:'get',
        url,
        //auth: { username: 'the_username', password: 'the_password' },
        mBody: mBody;
    })
    .then(function (axresponse) {
        res.send(JSON.stringify(axresponse.data));
    })
    .catch(function (error) {
        console.log(error);
    });
    /*
    axios({
        method: 'post',
        url: 'https://your.service.org/user/12345',
        data: { firstName: 'Fred', lastName: 'Flintstone' }
    });
    * /
});

var server = app.listen(port);
*/

//
//  This needs to be forever **TODO** improved **SEARCH**
//
router.post(   '/search_action', function(req, res, next) {
    var successMsg = req.flash('success')[0];
    var sw = ".*"+req.body.newtask+".*";
    //<!-- works:  Package.find(   {ptitle: /.*urkey/}, function (err, docs) { -->
    Package.find(   {ptitle: {$regex: sw}}, function (err, docs) {
        if (err) {
	        console.log("-ERR-  "+req.method+req.originalUrl+"  package.find "+ err._message);
            return res.redirect('/');
        }
        var packageChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            packageChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render(   'shop/index', { title: 'Shopping Cart', 
                packageR: packageChunks, imgDir: "http://localhost:" + process.env.PORT, successMsg: successMsg, noMessages: !successMsg
        });   // dcount: docs.length
    }).lean();
});





/* GET the individual stern tables */

router.get(   '/kurum', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    //console.log("i18n.getLocale()"+ i18n.getLocale());
    Package.find(   function (err, docs) {
        if (err) {
    	    console.log("-ERR-  "+req.method+req.originalUrl+"  package.find "+ err._message );
            return res.redirect('/');
        }
        var packageChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            packageChunks.push(docs.slice(i, i + chunkSize));
        }
        //console.log("  ::  "+req.method+req.originalUrl+"  packageChunks "); console.log(packageChunks);
        res.render(   'shop/index', { title: 'Shopping Cart',
                packageR: packageChunks, imgDir: "http://localhost:"+process.env.PORT, successMsg: successMsg, noMessages: !successMsg
        });   // dcount: docs.length
    }).lean();
});


router.get(   '/packageLanding/:pid/:iid', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    var packageId = req.params.pid;
    json = {};
    Package.findById(   packageId, function(err, pdocs) {
        if (err) {
    	    console.log("-ERR-  "+req.method+req.originalUrl+"  Package.findById "+ err._message);
            return res.write('Could not find package contact your host!');
        } else {
            console.log("  ::  "+req.method+req.originalUrl+ " title:"+ pdocs.title)
            res.redirect('/packDetails/'+ packageId);
        }
    })
});

router.get(   '/packDetails/:pid', function(req, res, next) {
    var successMsg = req.flash('success')[0];
    var packageId = req.params.pid;
    var json = {}
    PackageRepeatActivity.findById(   packageId, function(err, pdocs) {
        if (err) {
    	    console.log("-ERR-  "+req.method+req.originalUrl+"  Package.findById "+ err._message);
            return res.redirect('/');
        } else {
            json.PackR = pdocs;
            //console.log("  ::  "+req.method+req.originalUrl+" pdocs: "); console.log(pdocs);
            Repeat.find(   {'_id': {$in:   pdocs.repeat}}, function(err, rdocs) {
                if (err) {
                    console.log("-ERR-  "+req.method+req.originalUrl+"  Repeat.find "+ err._message);
                    return res.redirect('/');
                } else {
                    json.RepeatR = rdocs;
                    // SQL commands run async so order cant be determined unless capsulated in waterfall
                    var tblActId = [];
                    for (var oo = pdocs.activity.length >>> 0; oo--;) { tblActId.push(pdocs.activity[oo].actyId); }
                    Activity.find(   {'_id': {$in: tblActId}}, function(err, adocs) {
                        if (err) {
                            console.log("-ERR-  "+req.method+req.originalUrl+"  Activity.findById "+ err._message);
                            return res.redirect('/');
                        } else {
                            //console.log("  ::  "+req.method+req.originalUrl+" adocs: "); console.log(adocs);
                            for (var ii = pdocs.activity.length >>> 0; ii--;) {
                                    pdocs.activity[ii].ActivityR = adocs[ii]; //TODO match adocs to activity
                            }
                            json.PackR = pdocs;
                            //console.log("  ::  "+req.method+req.originalUrl+" json "); console.log(json);
                            res.render(   'shop/pack_detail', { title: 'Tour Details',
                                packDetR: json, imgDir: "http://localhost:" + process.env.PORT, isOP: globs.isOperator, successMsg: successMsg, noMessages: !successMsg
                            });
                        }
                        //console.log("  ::  "+req.method+req.originalUrl+" pdocs.activity[*]: "); console.log(pdocs.activity);
                        //console.log("  ::  "+req.method+req.originalUrl+" done activity.find ");
                    }).lean();
                }
                //console.log("  ::  "+req.method+req.originalUrl+" done repeat.find ");
            }).sort("dstart").lean();   // dcount: docs.length 
        }
        //console.log("  ::  "+req.method+req.originalUrl+" done package.find ");
    }).lean();		  // .populate(repeat_pack).lean();
});






router.get(   '/add-to-cart/:pid', function(req, res, next) {
    var packageId = req.params.pid;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    //console.log("  ::  "+req.method+req.originalUrl+" res.req.headers.cookie"+ res.req.headers.cookie);
    if (packageId === undefined) {
       	packageId = req.connection._peername.address;
    }

    Package.findById(   packageId, function(err, package_m) {
        if (err) {
	        console.log("-ERR-  "+req.method+req.originalUrl+"  package.findById "+ err._message);
            return res.redirect('/');
        }
        cart.add(package_m, package_m._id);
        req.session.cart = cart;
        res.redirect('/packDetails/'+packageId);
    }).lean();
});

router.get(   '/reduce/:pid', function(req, res, next) {
    var packageId = req.params.pid;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(packageId);
    req.session.cart = cart;
    res.redirect('/shopping_cart');		//actual or virtual ??
});
router.get(   '/remove/:pid', function(req, res, next) {
    var packageId = req.params.pid;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(packageId);
    req.session.cart = cart;
    res.redirect('/shopping_cart');
});

router.get(   '/shopping_cart', function(req, res, next) {
   if (!req.session.cart) {
       return res.render('shop/shopping_cart', {packageR: null});  // ,dcount:0
   } 
   var cart = new Cart(req.session.cart);
   res.render('shop/shopping_cart', {packageR: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get(   '/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping_cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});
router.post(   '/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping_cart');
    }
    var cart = new Cart(req.session.cart);
    
    /*
    var stripe = require("stripe") (
        "sk_test_fwmVPdJfpkmwlQRedXec5IxR"
    );

    stripe.charges.create(    {
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
       if (err) {
    	    console.log("-ERR-  "+req.method+req.originalUrl+"  stripe.charges.create "+ err._message);
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
    */
        var ord = new Orders({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: "xx"//charge.id
        });
        ord.save(function(err, result) {
            req.flash('success', 'Successfully bought package!');
            req.session.cart = null;
            res.redirect('/');
        });
   // }); 
});





//  The remaining require to be logged in

router.get(   '/myOrders', isLoggedIn, function (req, res, next) {
    //console.log("  ::  "+req.method+req.originalUrl+" user:"+ req.user)
    Orders.find({user: req.user._id}, function(err, odocs) {
        if (err) {
            console.log("-ERR-  "+req.method+req.originalUrl+"  userId: "+ req.user._id+ " -- "+ err._message);
            return res.write('Error!');
        }
        if (odocs == null) console.log("*NULL   get/myOrders userid: "+ req.user._id);
        var arr = [];
        for (var oo = odocs.length >>> 0; oo--;) {
            var ci = odocs[oo].cart.items;
            for (var cc in ci) {
                var theItem = {};
                console.log("ci[cc]::"); console.log(ci[cc].item);
                theItem.ptitle = ci[cc].item.ptitle;
                theItem.pprice = ci[cc].item.pprice;
                arr.push(theItem);
            }
        }
        console.log("ItemArr:"); console.log(arr);
        /*
        odocs.forEach(function(odocs) {
            cart = new Cart(odocs.cart);
            odocs.items = cart.generateArray();
        });
        */
        res.render('shop/my_orders', {packageR: arr});
    }).lean();
});



router.get(   '/myFavorites', isLoggedIn, function (req, res, next) {
    Orders.find({user: req.user}, function(err, odocs) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        odocs.forEach(function(odocs) {
            cart = new Cart(odocs.cart);
            odocs.items = cart.generateArray();
        });
        res.render('shop/my_favorites', { orders: odocs });
    }).lean();
});




router.get(   '/myFollowing', isLoggedIn, function (req, res, next) {
    Orders.find({user: req.user}, function(err, odocs) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        odocs.forEach(function(odocs) {
            cart = new Cart(odocs.cart);
            odocs.items = cart.generateArray();
        });
        res.render('shop/my_following', { orders: odocs });
    }).lean();
});




router.get(   '/myLikes', isLoggedIn, function (req, res, next) {
    Orders.find({user: req.user}, function(err, odocs) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        odocs.forEach(function(odocs) {
            cart = new Cart(odocs.cart);
            odocs.items = cart.generateArray();
        });
        res.render('shop/my_likes', { orders: odocs });
    }).lean();
});


module.exports = router;

var globs = require('../services/globs');

function isLoggedIn(req, res, next) {
    //console.log("  ::  "+req.method+req.originalUrl+" isOperatorX:"+ globs.isOperator+ " req.user._doc:"); console.log(req.user._doc);
    if (req.isAuthenticated()) {
        if (globs.isOperator == null) globs.setIsOperator(req.user._doc.utype);
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
