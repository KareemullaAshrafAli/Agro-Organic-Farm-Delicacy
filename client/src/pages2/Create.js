import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductCard from "./ProductCard";
import './create.css'
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/features/auth/authSlice';

import Header2 from '../components/header/Header2';
import Footer from "../components/footer/Footer"
import { base_url } from '../utils/config';


const Create = () => {

 
    const {user}=useSelector((state)=>state.auth);
    // console.log(user?.email)
  
  const dispatch=useDispatch();
  useEffect(()=>{
  if(user===null){
    dispatch(getUser());
 }
},[dispatch,user])
  

  // const { cartItems, addToCart } = useCart();

  const [productData, setProductData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState(null);
  const [selectedSortOrder, setSelectedSortOrder] = useState(null);
  const [filters, setFilters] = useState({
    dairyMeat: false,
    seeds: false,
    machines: false,
    fruit: false,
    vegetable: false,
  });
  const [searchTerm, setSearchTerm] = useState("");




  useEffect(() => {
    axios.get(`${base_url}/api/products`)
      .then(res => {
        // Filter products where selected is equal to "1"
        const allProducts = res.data;
  
        // Get the current date to filter products added this month
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
  
        const productsAddedThisMonth = allProducts.filter(product => {
          const productDate = new Date(product.date); // Assuming your product has a date field
          return productDate.getFullYear() === currentYear && productDate.getMonth() === currentMonth;
        });
  
        // Sort products added this month by date in descending order
        productsAddedThisMonth.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });
  
        // Get remaining products
        const remainingProducts = allProducts.filter(product => !productsAddedThisMonth.includes(product));
  
        // Concatenate productsAddedThisMonth and remainingProducts
        const sortedProducts = [...productsAddedThisMonth, ...remainingProducts];
  
        setProductData(sortedProducts);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  
  
  
  
  



  


  


  const applyFilters = () => {
    // console.log("Selected Sort Order:", selectedSortOrder);
    let filtered = [...productData];
    filtered = filtered.filter(product => product.selected === "1");
    if (selectedSortOrder === "priceLowToHigh") {
      filtered = filtered.sort((a, b) => parseFloat(a.product_mrp*(1-a.offer/100)) - parseFloat(b.product_mrp*(1-b.offer/100)));
    } else if (selectedSortOrder === "priceHighToLow") {
      filtered = filtered.sort((a, b) => parseFloat(b.product_mrp*(1-b.offer/100)) - parseFloat(a.product_mrp*(1-a.offer/100)));
    } else if (selectedSortOrder === "discountHighToLow") {
      filtered = filtered.sort((a, b) => parseFloat(b.offer) - parseFloat(a.offer));
    }
    // console.log("Filtered Products after Sorting:", filtered);

    if (selectedPriceFilter === "filter0") {
      filtered = filtered.filter(
        (product) => parseFloat((product.product_mrp*(1-product.offer/100)).toFixed(2)) > 0
      );
    }

    if (selectedPriceFilter === "filter1") {
      filtered = filtered.filter(
        (product) => parseFloat((product.product_mrp*(1-product.offer/100)).toFixed(2)) < 100
      );
    }

    if (selectedPriceFilter === "filter2") {
      filtered = filtered.filter(
        (product) =>
          parseFloat((product.product_mrp*(1-product.offer/100)).toFixed(2)) >= 100 &&
          parseFloat((product.product_mrp*(1-product.offer/100)).toFixed(2)) < 500
      );
    }

    if (selectedPriceFilter === "filter3") {
      filtered = filtered.filter(
        (product) =>
          parseFloat((product.product_mrp*(1-product.offer/100)).toFixed(2)) >= 500 &&
          parseFloat((product.product_mrp*(1-product.offer/100)).toFixed(2)) < 1000
      );
    }

    if (selectedPriceFilter === "filter4") {
      filtered = filtered.filter(
        (product) => parseFloat((product.product_mrp*(1-product.offer/100)).toFixed(2)) >= 1000
      );
    }
    

    if (
      filters.dairyMeat === true &&
      filters.seeds === false &&
      filters.machines === false &&
      filters.fruit === false &&
      filters.vegetable === false
    ) {
      filtered = filtered.filter(
        (product) => product.product_type === "Dairy/Meat"
      );
    }

    if (
      filters.seeds === true &&
      filters.dairyMeat === false &&
      filters.machines === false &&
      filters.fruit === false &&
      filters.vegetable === false
    ) {
      filtered = filtered.filter((product) => product.product_type === "Seeds");
    }

    if (
      filters.machines === true &&
      filters.dairyMeat === false &&
      filters.seeds === false &&
      filters.fruit === false &&
      filters.vegetable === false
    ) {
      filtered = filtered.filter(
        (product) => product.product_type === "HTP Machines"
      );
    }

    if (
      filters.fruit === true &&
      filters.dairyMeat === false &&
      filters.seeds === false &&
      filters.machines === false &&
      filters.vegetable === false
    ) {
      filtered = filtered.filter((product) => product.product_type === "Fruit");
    }

    if (
      filters.vegetable === true &&
      filters.dairyMeat === false &&
      filters.seeds === false &&
      filters.machines === false &&
      filters.fruit === false
    ) {
      filtered = filtered.filter(
        (product) => product.product_type === "Vegetable"
      );
    }

    if (
      filters.dairyMeat === true &&
      filters.seeds === true &&
      filters.machines === false &&
      filters.fruit === false &&
      filters.vegetable === false
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Dairy/Meat" ||
          product.product_type === "Seeds"
      );
    }

    if (
      filters.dairyMeat === true &&
      filters.seeds === true &&
      filters.machines === true &&
      filters.fruit === false &&
      filters.vegetable === false
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Dairy/Meat" ||
          product.product_type === "Seeds" ||
          product.product_type === "HTP Machines"
      );
    }

    if (
      filters.dairyMeat === true &&
      filters.seeds === true &&
      filters.machines === true &&
      filters.fruit === true &&
      filters.vegetable === false
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Dairy/Meat" ||
          product.product_type === "Seeds" ||
          product.product_type === "HTP Machines" ||
          product.product_type === "Fruit"
      );
    }

    if (
      filters.dairyMeat === true &&
      filters.seeds === true &&
      filters.machines === true &&
      filters.fruit === true &&
      filters.vegetable === true
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Dairy/Meat" ||
          product.product_type === "Seeds" ||
          product.product_type === "HTP Machines" ||
          product.product_type === "Fruit" ||
          product.product_type === "Vegetable"
      );
    }

    if (
      filters.dairyMeat === true &&
      filters.seeds === true &&
      filters.machines === true &&
      filters.fruit === false &&
      filters.vegetable === true
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Dairy/Meat" ||
          product.product_type === "Seeds" ||
          product.product_type === "HTP Machines" ||
          product.product_type === "Vegetable"
      );
    }

    if (
      filters.dairyMeat === true &&
      filters.seeds === true &&
      filters.machines === false &&
      filters.fruit === true &&
      filters.vegetable === false
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Dairy/Meat" ||
          product.product_type === "Seeds" ||
          product.product_type === "Fruit"
      );
    }

    if (
      filters.dairyMeat === true &&
      filters.seeds === true &&
      filters.machines === false &&
      filters.fruit === true &&
      filters.vegetable === true
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Dairy/Meat" ||
          product.product_type === "Seeds" ||
          product.product_type === "Fruit" ||
          product.product_type === "Vegetable"
      );
    }

    if (
      filters.dairyMeat === true &&
      filters.seeds === false &&
      filters.machines === true &&
      filters.fruit === false &&
      filters.vegetable === false
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Dairy/Meat" ||
          product.product_type === "HTP Machines"
      );
    }

    if (
      filters.dairyMeat === true &&
      filters.seeds === false &&
      filters.machines === true &&
      filters.fruit === false &&
      filters.vegetable === true
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Dairy/Meat" ||
          product.product_type === "HTP Machines" ||
          product.product_type === "Vegetable"
      );
    }

    if (
      filters.dairyMeat === true &&
      filters.seeds === false &&
      filters.machines === true &&
      filters.fruit === true &&
      filters.vegetable === false
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Dairy/Meat" ||
          product.product_type === "HTP Machines" ||
          product.product_type === "Fruit"
      );
    }

    if (
      filters.dairyMeat === true &&
      filters.seeds === false &&
      filters.machines === true &&
      filters.fruit === true &&
      filters.vegetable === true
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Dairy/Meat" ||
          product.product_type === "HTP Machines" ||
          product.product_type === "Fruit" ||
          product.product_type === "Vegetable"
      );
    }

    if (
      filters.dairyMeat === true &&
      filters.seeds === false &&
      filters.machines === false &&
      filters.fruit === true &&
      filters.vegetable === false
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Dairy/Meat" ||
          product.product_type === "Fruit"
      );
    }

    if (
      filters.dairyMeat === true &&
      filters.seeds === false &&
      filters.machines === false &&
      filters.fruit === true &&
      filters.vegetable === true
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Dairy/Meat" ||
          product.product_type === "Fruit" ||
          product.product_type === "Vegetable"
      );
    }

    if (
      filters.dairyMeat === true &&
      filters.seeds === false &&
      filters.machines === false &&
      filters.fruit === false &&
      filters.vegetable === true
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Dairy/Meat" ||
          product.product_type === "Vegetable"
      );
    }

    if (
      filters.dairyMeat === false &&
      filters.seeds === true &&
      filters.machines === true &&
      filters.fruit === false &&
      filters.vegetable === false
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Seeds" ||
          product.product_type === "HTP Machines"
      );
    }

    if (
      filters.dairyMeat === false &&
      filters.seeds === true &&
      filters.machines === true &&
      filters.fruit === false &&
      filters.vegetable === true
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Seeds" ||
          product.product_type === "HTP Machines" ||
          product.product_type === "Vegetable"
      );
    }

    if (
      filters.dairyMeat === false &&
      filters.seeds === true &&
      filters.machines === true &&
      filters.fruit === true &&
      filters.vegetable === false
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Seeds" ||
          product.product_type === "HTP Machines" ||
          product.product_type === "Fruit"
      );
    }

    if (
      filters.dairyMeat === false &&
      filters.seeds === true &&
      filters.machines === true &&
      filters.fruit === true &&
      filters.vegetable === true
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Seeds" ||
          product.product_type === "HTP Machines" ||
          product.product_type === "Fruit" ||
          product.product_type === "Vegetable"
      );
    }

    if (
      filters.dairyMeat === false &&
      filters.seeds === true &&
      filters.machines === false &&
      filters.fruit === true &&
      filters.vegetable === false
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Seeds" || product.product_type === "Fruit"
      );
    }

    if (
      filters.dairyMeat === false &&
      filters.seeds === true &&
      filters.machines === false &&
      filters.fruit === true &&
      filters.vegetable === true
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Seeds" ||
          product.product_type === "Fruit" ||
          product.product_type === "Vegetable"
      );
    }

    if (
      filters.dairyMeat === false &&
      filters.seeds === true &&
      filters.machines === false &&
      filters.fruit === false &&
      filters.vegetable === true
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Seeds" ||
          product.product_type === "Vegetable"
      );
    }

    if (
      filters.dairyMeat === false &&
      filters.seeds === false &&
      filters.machines === true &&
      filters.fruit === true &&
      filters.vegetable === false
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "HTP Machines" ||
          product.product_type === "Fruit"
      );
    }

    if (
      filters.dairyMeat === false &&
      filters.seeds === false &&
      filters.machines === true &&
      filters.fruit === true &&
      filters.vegetable === true
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "HTP Machines" ||
          product.product_type === "Fruit" ||
          product.product_type === "Vegetable"
      );
    }

    if (
      filters.dairyMeat === false &&
      filters.seeds === false &&
      filters.machines === true &&
      filters.fruit === false &&
      filters.vegetable === true
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "HTP Machines" ||
          product.product_type === "Vegetable"
      );
    }

    if (
      filters.dairyMeat === false &&
      filters.seeds === false &&
      filters.machines === false &&
      filters.fruit === true &&
      filters.vegetable === true
    ) {
      filtered = filtered.filter(
        (product) =>
          product.product_type === "Fruit" ||
          product.product_type === "Vegetable"
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
    if (selectedPriceFilter === null) {
      setSelectedPriceFilter("filter0"); // or the default value you want
    }
  }, [productData, selectedSortOrder, selectedPriceFilter, filters, searchTerm]);


// const isProductInCartWithStatus = (productName) => {
//   console.log("Checking product:", productName);
//   return productData.some((item) => {
//     console.log("Cart item:", item);
//     return item.product_name === productName && item.status1 === 0;
//   });
// };



const handleAddToCart = async (product) => {
  try {
    const userEmail = user ? user.email : null;

    if (!userEmail) {
      console.error("User email is undefined or null");
      return;
    }

    const response = await axios.get(`${base_url}/api/cart?email=${userEmail}`);
    const userCartItems = response.data;

    const isProductInCartWithStatus = (productName) => {
      return userCartItems.some((item) => item.product_name === productName && item.status1 === 0);
    };


  
  if (!isProductInCartWithStatus(product.product_name)) {
    const newProduct = {
      p_id: product._id,
      product_name: product.product_name,
      product_mrp: product.product_mrp,
      product_selling_price: product.product_selling_price,
      offer: product.offer,
      product_type: product.product_type,
      quantity: 1,
      email: userEmail,
      status1: 0,
      product_img: product.product_img
     
      // product_images: imgSrc
      // Use the imgSrc here
    };

      
      await axios.post(`${base_url}/api/addToCart`, newProduct);
      toast.success("Item added to cart");
    } else {
      toast.error("Item is already in the cart");
    }
  } catch (error) {
    console.error("Error handling cart:", error);
    toast.error("Failed to handle cart");
  }
};




  
  // Generate a new unique ID not present in the user's cart
  // const generateNewId = (userCartItems) => {
  //   let newProductId;
  //   do {
  //     newProductId = Math.floor(Math.random() * 10000); // Example: Generate a random number as ID
      
  //   } while (userCartItems.some((item) => item._id === newProductId));
  //   return newProductId;
  // };
  
  // console.log("Filtered Products:", filteredProducts);


  const handleTypeFilterToggle = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  return (
    <>
     <div style={{position:'fixed', width:'100%', zIndex:'9999', top:'0'}}>
      <Header2/>
      </div>
    
    <div className="create-page-body">
      <div className="product-filters left-div">
        <input
          type="text"
          className="search_5"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <br />
        <div className="product-filters">
          <p className="filter-sort-title ">Sort by</p>
          <label>
            <input
              type="radio"
              name="sort-filter"
              checked={selectedSortOrder === "priceLowToHigh"}
              onChange={() => setSelectedSortOrder("priceLowToHigh")}
            />
            Price Low to High
          </label>
          <label>
            <input
              type="radio"
              name="sort-filter"
              checked={selectedSortOrder === "priceHighToLow"}
              onChange={() => setSelectedSortOrder("priceHighToLow")}
            />
            Price High to Low
          </label>
          <label>
            <input
              type="radio"
              name="sort-filter"
              checked={selectedSortOrder === "discountHighToLow"}
              onChange={() => setSelectedSortOrder("discountHighToLow")}
            />
            Discount % High to Low
          </label>
        </div>
        <div className="product-filters">
          <p className="filter-sort-title">Price</p>
          <label>
            <input
              type="radio"
              name="price-filter"
              checked={selectedPriceFilter === "filter0"}
              onChange={() => setSelectedPriceFilter("filter0")}
            />
            All
          </label>
          <label>
            <input
              type="radio"
              name="price-filter"
              checked={selectedPriceFilter === "filter1"}
              onChange={() => setSelectedPriceFilter("filter1")}
            />
            Less than ₹100
          </label>
          <label>
            <input
              type="radio"
              name="price-filter"
              checked={selectedPriceFilter === "filter2"}
              onChange={() => setSelectedPriceFilter("filter2")}
            />
            ₹100 to ₹500
          </label>
          <label>
            <input
              type="radio"
              name="price-filter"
              checked={selectedPriceFilter === "filter3"}
              onChange={() => setSelectedPriceFilter("filter3")}
            />
            ₹500 to ₹1000
          </label>
          <label>
            <input
              type="radio"
              name="price-filter"
              checked={selectedPriceFilter === "filter4"}
              onChange={() => setSelectedPriceFilter("filter4")}
            />
            More Than ₹1000
          </label>
        </div>
        <div className="product-filters">
          <p className="filter-sort-title">Category</p>
          <label>
            <input
              type="checkbox"
              name="dairyMeat"
              checked={filters.dairyMeat}
              onChange={handleTypeFilterToggle}
            />
            Dairy/Meat
          </label>
          <label>
            <input
              type="checkbox"
              name="seeds"
              checked={filters.seeds}
              onChange={handleTypeFilterToggle}
            />
            Seeds
          </label>
          <label>
            <input
              type="checkbox"
              name="machines"
              checked={filters.machines}
              onChange={handleTypeFilterToggle}
            />
            HTP Machines
          </label>
          <label>
            <input
              type="checkbox"
              name="fruit"
              checked={filters.fruit}
              onChange={handleTypeFilterToggle}
            />
            Fruits
          </label>
          <label>
            <input
              type="checkbox"
              name="vegetable"
              checked={filters.vegetable}
              onChange={handleTypeFilterToggle}
            />
            Vegetables
          </label>
        </div>
      </div>
      <div>
        <ul className="products-list">
        {filteredProducts.map((product) => (
          
          <ProductCard key={product._id} product={product} handleAddToCart={handleAddToCart} />
        ))}

        </ul>
      </div>
      <ToastContainer />
    </div>
    <Footer/>
    </>
  );
};

export default Create;
