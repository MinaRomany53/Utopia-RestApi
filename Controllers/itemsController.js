exports.checkBody = (req, res, next) => {
  if (!req.body.title || !req.body.price || !req.body.category) {
    return res.status(400).json({
      status: "Failed",
      date: req.date,
      message: "Please Add (title , price , category) to your post request",
    });
  }
  next();
};

exports.getAllItems = (req, res) => {
  res.status(200).json({
    status: "Success",
    date: req.date,
    results: 20,
    data: {
      Message: "All Items Listed here",
    },
  });
};

exports.addNewItem = (req, res) => {
  console.log(req.body);
  res.status(201).json({
    status: "Success",
    date: req.date,
    Message: "New Item Added Successfully",
  });
};

exports.getItem = (req, res) => {
  let id = req.params.itemId * 1;
  if (!id) {
    res.status(404).json({
      status: "Failed",
      date: req.date,
      data: {
        Message: "Invalid Id ❌",
      },
    });
  } else {
    res.status(200).json({
      status: "Success",
      date: req.date,
      data: {
        Message: `Item - ${id}  All Information Listed Here ✅`,
      },
    });
  }
};

exports.updateItem = (req, res) => {
  console.log(req.body);
  let id = req.params.itemId * 1;
  if (!id) {
    res.status(404).json({
      status: "Success",
      date: req.date,
      data: {
        Message: "Invalid Id ❌",
      },
    });
  } else {
    res.status(201).json({
      status: "Success",
      date: req.date,
      data: {
        Message: `Item - ${id}  Updated ✅`,
      },
    });
  }
};

exports.deleteItem = (req, res) => {
  let id = req.params.itemId * 1;
  if (!id) {
    res.status(404).json({
      status: "Success",
      date: req.date,
      data: {
        Message: "Invalid Id ❌",
      },
    });
  } else {
    res.status(204).json({
      status: "Success",
      date: req.date,
      data: null,
    });
  }
};
