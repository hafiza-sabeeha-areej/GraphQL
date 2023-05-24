const graphql = require("graphql");
//Importing models here
const Book = require("../models/book");
const Author = require("../models/author");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;
var _ = require("lodash");
//T3MTbKcn21siSW32
//This is basically dummy data to store without Db
// const books = [
//     {
//       name: "Book 1",
//       genre: "Fantasy",
//       id: "1",
//       authorId: '2'
//     },
//     {
//       name: "Book 2",
//       genre: "Mystery",
//       id: "2",
//       authorId: '3'
//     },
   
//   ];

// const authors = [
//     {
//       name: "Author 1",
//       age: 30,
//       id: "1"
//     },
//     
//  ];
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    //Here We are actually filtering all the books written by a specific author as It is a list of a books so we are using GraphQLList
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        console.log(parent);
        //treating author as a parent and accessing its id
        //  return _.filter(books,{authorId:parent.id})
        //Above  commented lines are for dummy data
        //this time We are going to use book model to fetch all the books associated with specific author
        //Accessing Db
        return Book.find({ authorId: parent.id });
      },
    },
  }),
});
//author must be define before it is refrenced by another object

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    //Here We are finding a specific author along with book
    authors: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent);
        //treating author as a parent and accessing its id
        //  return _.find(authors,{id:parent.authorId})
        //Above commented lines are for local data save
        //We are using Author model to find the autor on the basis of Id store in a book through DB
        return Author.findById(parent.authorId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  //Here we are finding a specific book
  fields: {
    book: {
      type: BookType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        console.log(typeof args.id);

        // return _.find(books, { id: args.id });
        //Find specific book through Model from Db
        return Book.findById(args.id);
      },
    },

    //Here we are finding specific author
    author: {
      type: AuthorType,

      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        // return _.find(authors,{id:args.id})
        //Find specific Author through Model from Db
        return Book.findById(args.id);
      },
    },
    //Here We are going to find all the books
    //It will also return  List of books as We are going to enlist all books
    books: {
      //Due to list We are using GraphQLlist
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books
        console.log("Parent in books", parent);
        // return Book.find({authorId:parent.id})
        //To search for all books
        return Book.find({});
      },
    },
    authors: {
      //Due to list We are using GraphQLlist
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        //To Search for all authors
        return Author.find({});
      },
    },
  },
});
//Mutation is basically used to store the data
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    //to add author in the database
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        //this new Author is basically a model coming from models
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        //Here We are saving the data
        return author.save();
      },
    },
    //To add a book in the database
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID },
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        //save
        return book.save();
      },
    },
  },
});
//Exporting these modules as We are using it in our entry point app.js and in Schema model
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
