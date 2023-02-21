const Item = require("../Models/itemModel");
const ApiFeatures = require("../Utils/apiFeatures");

exports.getCategoryStats = async (req, res) => {
  try {
    const statistics = await Item.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: "$category",
          Number_Of_Items: { $sum: 1 },
          Max_Price: { $max: "$price" },
          Min_Price: { $min: "$price" },
          Items: { $push: "$title" },
        },
      },
      {
        $sort: { Number_Of_Items: -1 },
      },
    ]);

    console.log(statistics);

    res.status(200).json({
      status: "Success",
      date: req.date,
      results: statistics.length,
      data: {
        statistics: statistics,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      date: req.date,
      message: err.message,
    });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    // Build Query step by step ( 1.Filtering  2.Sorting  3.Field Limiting  4.Pagination )
    const features = new ApiFeatures(Item.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute Query
    const items = await features.query;

    // Send response (end req-res cycle)
    res.status(200).json({
      status: "Success",
      date: req.date,
      results: items.length,
      data: {
        items: items,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      date: req.date,
      message: err.message,
    });
  }
};

exports.addNewItem = async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.status(201).json({
      status: "Success",
      date: req.date,
      item: newItem,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      date: req.date,
      message: err.message,
    });
  }
};

exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      res.status(404).json({
        status: "Fail",
        date: req.date,
        Message: "Invalid ID ❌",
      });
    } else {
      res.status(200).json({
        status: "Success",
        date: req.date,
        data: { item: item },
      });
    }
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      date: req.date,
      message: err.message,
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.itemId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      res.status(404).json({
        status: "Fail",
        date: req.date,
        Message: "Invalid ID ❌",
      });
    } else {
      res.status(200).json({
        status: "Success",
        date: req.date,
        data: { item: item },
      });
    }
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      date: req.date,
      message: err.message,
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.itemId);
    if (!deletedItem) {
      res.status(404).json({
        status: "Fail",
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
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      date: req.date,
      message: err.message,
    });
  }
};
