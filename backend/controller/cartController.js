const User = require("../module/UserModel");
const Product = require("../module/ProductModel");
const { sendNotification } = require("../utils/PushNotification");
const addProduct = async (req, res, next) => {
  const { userId, productId, resturantId } = req.body;
  const product = await Product.findById(productId);
  const price = product.price;

  // const item = {
  //    product: productId,
  //     price
  // }
  // let users = await User.findById(userId);
  // let fcmToken = users.fcmToken;
  // let data = {
  //   title: "cart",
  //   body: "product added in cart successfully",
  //   image:
  //     "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80",
  // };
  // sendNotification(fcmToken, data);
  const item = {
    product: productId,
    quantity: 1,
  };
  const firstItem = await User.findById(userId, { cart: 1 });
  if (firstItem.cart.products.length === 0) {
    try {
      let userData = await User.findByIdAndUpdate(userId, {
        $push: { "cart.products": item },
      });
      //  userData = await User.findOneAndUpdate({_id:userId}, {
      //    $inc: { "cart.total": price },
      //  });

      userData = await User.findByIdAndUpdate(
        userId,
        {
          $inc: { "cart.total": price },
        },
        {
          new: true,
        }
      );

      userData = await User.findByIdAndUpdate(userId, {
        "cart.resturant": resturantId,
      });
      userData = await User.findById(userId);

      return res.status(200).json({ data: userData });
    } catch (e) {
      return res.status(500).json({ check: e });
    }
  }
  const existOrNot = await User.find({
    _id: userId,
    "cart.products.product": productId,
  });
  if (existOrNot.length === 0) {
    try {
      let userData = await User.findByIdAndUpdate(userId, {
        $push: { "cart.products": item },
      });
      userData = await User.findByIdAndUpdate(userId, {
        $inc: { "cart.total": price },
      });
      userData = await User.findById(userId);

      return res.status(200).json({ data: userData });
    } catch (e) {
      return res.status(500).json({ message: e });
    }
  } else {
    next();
  }
};

const itemAlreadyExistUpdateQuantity = async (req, res) => {
  let { productId, userId } = req.body;
  const product = await Product.findById(productId);
  const price = product.price;

  try {
    // const data = await User.findByIdAndUpdate(productId,{"cart.products.product":productId},{
    //   $inc:{"cart.total":price}
    // })
    let data = await User.findOneAndUpdate(
      {
        _id: userId,
        "cart.products.product": productId,
      },
      {
        $inc: { "cart.products.$.quantity": 1 },
      }
    );
    data = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $inc: { "cart.total": price },
      }
    );
    data = await User.findById(userId);
    // const data = await User.findById(userId)
    res.status(200).json({ message: "product added", data });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

const addCartItemquantity = async (req, res) => {
  let { userId, itemId, productId } = req.body;
  console.log("hello");
  const product = await Product.findById(productId);
  const price = product.price;
  // const user = await User.find({_id:userId});
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId, "cart.products._id": itemId },
      {
        $inc: { "cart.products.$.quantity": 1, "cart.total": price },
      }
    );
    console.log(user);
    const check = await User.findById(userId).populate({
      path: "cart",
      populate: [
        {
          path: "products.product",
          model: "Product",
        },
      ],
    });
    console.log(check);

    return res
      .status(200)
      .json({ data: check, message: "product added in cart" });
  } catch (e) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

const subtractCartItemquantity = async (req, res, next) => {
  console.log("bsssss");
  let { userId, itemId, productId } = req.body;
  console.log(userId, itemId, productId);
  const product = await Product.findById(productId);
  const price = product.price;
  // const user = await User.find({_id:userId});
  try {
    const product = await Product.findById(productId);
    const price = product.price;

    let user = await User.findById(userId).populate({
      path: "cart",
      populate: [
        {
          path: "products.product",
          model: "Product",
        },
      ],
    });
    // const cartItem = cart.items.find(item => item.productId.toString() === productId);

    const cartItem = user.cart.products.find(
      (item) => item._id.toString() === itemId
    );

    if (!cartItem)
      return res.status(400).json({ message: "product not found" });

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      user.cart.total -= price;
    } else {
      user.cart.products = user.cart.products.filter(
        (item) => item._id.toString() !== itemId
      );
      user.cart.total -= price;
    }

    await user.save();

    console.log(user);
    res.status(200).json({ data: user });

    // user.cart.products.map(async (item) => {

    //   if (item.quantity <= 1) {
    //     console.log('why i am calling');
    //      next()
    //   } else {
    //     console.log('this is  completed');

    //     user = await User.findOneAndUpdate(
    //       { _id: userId, "cart.products._id": itemId },
    //       {
    //         $inc: { "cart.products.$.quantity": -1, "cart.total": -price },
    //       }
    //     );
    //     console.log("this is user ");
    //     console.log(user);
    //     const check = await User.findById(userId).populate({
    //       path: "cart",
    //       populate: [
    //         {
    //           path: "products.product",
    //           model: "Product",
    //         },
    //       ],
    //     });
    //     console.log(check);

    //      res.status(200).json({ data: check });
    //   }
    // })
  } catch (e) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

const fetchCartItem = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await User.findById(userId, { cart: 1 }).populate({
      path: "cart",
      populate: [
        {
          path: "products.product",
          model: "Product",
        },
      ],
    });
    // console.log(data[0].cart);
    return res.status(200).json({ data });
  } catch (e) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

const removeItem = async (req, res, next) => {
  console.log("log");
  let { userId, itemId, productId } = req.body;

  const product = await Product.findById(productId);
  const price = product.price;

  try {
    let response = await User.findOneAndUpdate(
      { _id: userId, "cart.products._id": itemId },
      {
        $inc: { "cart.products.$.quantity": -price },
        $unset: { "cart.resturant": "" },
      },
      { new: true }
    );
    response = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { "cart.products": { _id: itemId } },
      },
      { new: true }
    );

    console.log("check");
    console.log(JSON.stringify(response));
    if (response.cart.products.length == 0) {
      response = await User.findOneAndUpdate(
        { _id: userId },
        {
          $unset: { "cart.resturant": "" },
        },
        { new: true }
      );
    }
    console.log("hello how arre");
    console.log(response);
    res.status(200).json({
      message: "product deleted",
      data: response,
    });
  } catch (e) {
    console.log(e);
    res.status(501).json({ message: "something went wrong" });
  }
};

const removeItemCart = async (req, res, next) => {
  console.log("hey");
  const { userId, itemId, price, quantity } = req.body;
  let totalPrice = price * quantity;
  try {
    // const data =await User.updateOne({_id:userId},{$pull:{cart:{"products.$":itemId}}})
    // const data = await User.find({"cart.products.$._id":itemId,_id:userId},{

    // })
    let data = await User.findByIdAndUpdate(userId, {
      $pull: { "cart.products": { _id: itemId } },
    });
    data = await User.findByIdAndUpdate(userId, {
      $inc: { "cart.total": -totalPrice },
    });
    data = await User.findById(userId, { cart: 1 }).populate({
      path: "cart",
      populate: [
        {
          path: "products.product",
          model: "Product",
        },
      ],
    });
    console.log(data);
    if (data.cart.products.length == 0) {
      data = await User.findOneAndUpdate(
        { _id: userId },
        {
          $unset: { "cart.resturant": "" },
        },
        { new: true }
      );
    }
    console.log("pull");
    console.log(data);
    // const data = User.findById(userId,{$pull:{"cart.products.$":{_id:itemId}}},{
    //   new:true
    // })
    // let data = User.find({_id:userId,"cart.products.$._id1":itemId})
    // const data = await User.find({_id:userId})

    console.log(data);
    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

const clearCart = async (req, res, next) => {
  try {
    const { userId } = req.query;
    console.log(userId);

    const response = await User.findByIdAndUpdate(userId, {
      "cart.products": [],
      "cart.total": 0,
      $unset: { "cart.resturant": "" },
    });

    console.log(response);

    res.status(200).json({ message: "cart clear", response });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "something went wrong" });
  }
};

//   const addCartItem = async (req, res, next) => {
//     let { productId, userId, price } = req.body;
//     console.log("please check this");
//     console.log(productId, userId, price);
//     price = Number(price);
//     const item = {
//       product: productId,
//       quantity: 1,
//     };
//     const firstItem = await User.findById(userId, { cart: 1 });
//     console.log("first item first item first item first item");
//     console.log(firstItem);
//     console.log(firstItem.cart.products.length);
//     if (firstItem.cart.products.length === 0) {
//       try {
//         console.log("hey");
//         console.log(productId);
//         let userData = await User.findByIdAndUpdate(userId, {
//           $push: { "cart.products": item },
//         });
//         console.log(price);
//         //  userData = await User.findOneAndUpdate({_id:userId}, {
//         //    $inc: { "cart.total": price },
//         //  });

//         userData = await User.findByIdAndUpdate(userId, {
//           $inc: { "cart.total": price },
//         });
//         userData = await User.findById(userId);

//         console.log(userData);

//         return res.status(200).json({ data: userData });
//       } catch (e) {
//         return res.status(500).json({ check: e });
//       }
//     }
//     const existOrNot = await User.find({
//       _id: userId,
//       "cart.products.product": productId,
//     });
//     console.log(existOrNot);
//     console.log(
//       "exit exit exist exist exit exit exist exist exit exit exist exist exit exit "
//     );
//     console.log(existOrNot);
//     if (existOrNot.length === 0) {
//       try {
//         console.log(productId);
//         let userData = await User.findByIdAndUpdate(userId, {
//           $push: { "cart.products": item },
//         });
//         console.log(userData);
//         userData = await User.findByIdAndUpdate(userId, {
//           $inc: { "cart.total": price },
//         });
//         userData = await User.findById(userId);

//         console.log(userData);

//         return res.status(200).json({ data: userData });
//       } catch (e) {
//         return res.status(500).json({ message: e });
//       }
//     } else {
//       next();
//     }
//   };

module.exports = {
  addProduct,
  itemAlreadyExistUpdateQuantity,
  fetchCartItem,
  subtractCartItemquantity,
  addCartItemquantity,
  removeItemCart,
  removeItem,
  clearCart,
};
