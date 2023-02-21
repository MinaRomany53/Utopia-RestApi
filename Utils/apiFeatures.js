class ApiFeatures {
  constructor(query, requestedQuery) {
    this.query = query;
    this.requestedQuery = requestedQuery;
  }

  // 1) Filtering - Some advanced filtering
  filter() {
    const newQuery = JSON.parse(
      JSON.stringify(this.requestedQuery).replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      )
    );
    this.query = this.query.find(newQuery);
    return this;
  }

  // 2) Sorting - Sort documents based on specific fields
  sort() {
    if (this.requestedQuery.sort) {
      const sortBy = this.requestedQuery.sort.split(",").join(" ");
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createAt"); // default sort by created time from newest to oldest
    }
    return this;
  }

  // 3) Field Limiting - Return specified fields from the document
  limitFields() {
    if (this.requestedQuery.fields) {
      const fields = this.requestedQuery.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }
    this.query = this.query.select({ __v: 0 }); // default not showing this field
    return this;
  }

  // 4) Pagination - Divide documents into pages (user friendly)
  paginate() {
    const limit = this.requestedQuery.limit || 10;
    const page = this.requestedQuery.page || 1;
    this.query = this.query.skip((page - 1) * limit).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
