import { useEffect, useState } from "react";
import { Inputbox } from "../components/Inputbox";
import axios from "axios";
import { useSnackbar } from "notistack";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  CardActions,
} from "@mui/material";
import { CustomButton } from "../components/CustomButton";
import Footer from "../components/Footer";

export const Cart = () => {
  const [products, setProducts] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/online-products/getitems-from-onlinecart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts(response.data.CartProducts);
      } catch (error) {
        enqueueSnackbar("Failed to fetch products from cart", {
          variant: "error",
        });
      }
    };

    fetchProducts();
  }, [enqueueSnackbar, token]);

  const handleAddToCart = async (product) => {
    try {
      await axios.post(
        "http://localhost:3000/api/v1/online-products/add-to-cart-online",
        {
          productId: product._id,
          productQty: 1,
          productPrice: product.productPrice,
          productName: product.productName,
          productDescription: product.productDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      enqueueSnackbar("Product added to cart", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to add product to cart", { variant: "error" });
    }
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/online-products/delete-item/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
      enqueueSnackbar("Product removed from cart", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to remove product from cart", { variant: "error" });
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen ">
   <Navbar  showCart={true} showWishlist={true} showAccount={true} showDashboard={true} showStoreDashboard={false} showLogout={true} showLogin={false}/>
        <div className="m-4 font-semibold ">
  <span className="text-2xl text-cyan-900">CART : {products.length} ITEM </span>
</div>
<div className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product}>
               <CustomButton
                label="Remove from Cart"
                onClick={() => handleDelete(product._id)}
                className="ml-auto"
              />
              </ProductCard>
          ))}
        </div>
      </div>
      <Footer/>
      </div>
  );
};
