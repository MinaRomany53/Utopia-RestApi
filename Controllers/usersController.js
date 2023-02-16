exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: "Success",
    date: req.date,
    results: 10,
    data: {
      Message: "All Users Listed here",
    },
  });
};

exports.addNewUser = (req, res) => {
  console.log(req.body);
  res.status(201).json({
    status: "Success",
    date: req.date,
    Message: "New User Added Successfully",
  });
};

exports.getUser = (req, res) => {
  let id = req.params.userId * 1;
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
        Message: `User - ${id}  All Information Listed Here ✅`,
      },
    });
  }
};

exports.updateUser = (req, res) => {
  console.log(req.body);
  let id = req.params.userId * 1;
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
        Message: `User - ${id}  Updated ✅`,
      },
    });
  }
};

exports.deleteUser = (req, res) => {
  let id = req.params.userId * 1;
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
