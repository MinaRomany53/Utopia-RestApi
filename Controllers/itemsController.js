const Item = require("../Models/itemModel");
const ApiFeatures = require("../Utils/apiFeatures");
const ApiErrors = require("../Utils/apiErrors");

exports.getCategoryStats = async (req, res, next) => {
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

    res.status(200).json({
      status: "Success",
      date: req.date,
      results: statistics.length,
      data: {
        statistics: statistics,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllItems = async (req, res, next) => {
  try {
    // Build Query step by step ( 1.Filtering  2.Sorting  3.Field Limiting  4.Pagination )
    const features = new ApiFeatures(Item.find(), req.query)
      .filter()
      .paginate()
      .sort()
      .limitFields();

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
    next(err);
  }
};

exports.addNewItem = async (req, res, next) => {
  try {
    const newItem = await Item.create(req.body);
    res.status(201).json({
      status: "Success",
      date: req.date,
      item: newItem,
    });
  } catch (err) {
    next(err);
  }
};

exports.getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) return next(new ApiErrors(404, `Invalid ID !`));

    res.status(200).json({
      status: "Success",
      date: req.date,
      data: { item: item },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.itemId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) return next(new ApiErrors(404, `Invalid ID !`));

    res.status(200).json({
      status: "Success",
      date: req.date,
      data: { item: item },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.itemId);
    console.log(deletedItem);
    if (!deletedItem) return next(new ApiErrors(404, `Invalid ID !`));

    res.status(204).json({
      status: "Success",
      date: req.date,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
