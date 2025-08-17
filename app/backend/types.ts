// User
interface User {
  userid: number;
  password: string;
  role: string;
  name: string;
  email: string;
  phoneNo?: string;
  address?: string;
  date_of_birth?: Date; 
  join_date?: Date;     
}

// Book
// export interface Book {
//   bookid: number;
//   title: string;
//   author: string;
//   isbn: string;
//   description?: string;
//   userid?: number;
//   price: number;
//   stock: number;
//   date_publi?: Date;
// }

// // Genre
// export interface Genre {
//   genreid: number;
//   name: string;
//   description?: string;
// }

// // Book-Genre relation
// export interface BookGenre {
//   bookgenreid: number;
//   bookid: number;
//   genreid: number;
// }

// // Cart
// export interface Cart {
//   cartid: number;
//   userid: number;
// }

// // CartItem
// export interface CartItem {
//   cartitemid: number;
//   cartid: number;
//   bookid: number;
//   quantity: number;
// }

// // Order
// export interface Order {
//   orderid: number;
//   userid: number;
//   date: Date;          
//   total_amount: number;
// }

// // OrderItem
// export interface OrderItem {
//   orderitemid: number;
//   orderid: number;
//   bookid: number;
//   quantity: number;
//   price: number;
// }

// // Review
// export interface Review {
//   reviewid: number;
//   userid: number;
//   bookid: number;
//   rating: number;
//   review_description?: string;
//   review_date?: Date;
// }

export {User};