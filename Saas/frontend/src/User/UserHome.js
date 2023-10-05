import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import UserNavbar from './UserNabar'
function UserHome() {

  const token = localStorage.getItem("token");
  const decodeToken = jwt_decode(token);
  const organizationid = decodeToken.token.organizationId
  const userid = decodeToken.token._id

  const [data, setData] = useState([]);
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3500/addproduct', {
        productName,
        brand,
        category,
        price,
        quantity,
        UserId: userid,
        organizationId: organizationid,
      });
      if (res) {
        setProductName('');
        setBrand('');
        setCategory('');
        setPrice('');
        setQuantity('');
        toast.success(res.data.msg, {
          style: {
            background: 'lightblue',
            color: 'white',
          },
          progressStyle: {
            background: 'white',
          },
          icon: '🎉',
          iconTheme: {
            primary: 'white',
          },
        });
        getProduct();
      } else {
        toast.error(res.data.msg);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:3500/getproductbyid?UserId=${userid}`);
      setData(res.data.GetProById);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getProduct();
  }, []);

  const deleteProduct = async (item) => {
    try {
      const response = await axios.delete(`http://localhost:3500/deleteproduct/${item}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setData(response.data);
      if (response.status === 200) {
        toast.success('Product Deleted Successfully', {
          style: {
            background: 'lightblue',
            color: 'white',
          },
          progressStyle: {
            background: 'white',
          },
          icon: '🎉',
          iconTheme: {
            primary: 'white',
          },
        });
        getProduct();
      } else {
        toast.error('Internal Server Error');
      }
    } catch (error) {
      toast.error('Network Error:', error.message);
    }
  };

  const handleUpdateClick = (item) => {
    setSelectedProduct(item);
    setProductName(item.productName);
    setBrand(item.brand);
    setCategory(item.category);
    setPrice(item.price);
    setQuantity(item.quantity);
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3500/updateproduct/${selectedProduct._id}`,
        {
          productName,
          brand,
          category,
          price,
          quantity,
        }
      );
      if (response.status === 200) {
        setProductName('');
        setBrand('');
        setCategory('');
        setPrice('');
        setQuantity('');
        setSelectedProduct(null);
        toast.success('Product Update Successfully ', {
          style: {
            background: 'lightblue',
            color: 'white',
          },
          progressStyle: {
            background: 'white',
          },
          icon: '🎉',
          iconTheme: {
            primary: 'white',
          },
        });
        getProduct();
      } else {
        toast.error('Internal Server Error');
      }
    } catch (error) {
      toast.error('Network Error:', error.message);
    }
  };

  return (
    <>
      <div>
        <UserNavbar />
        {selectedProduct ? (
          <h2>UPDATE PRODUCT</h2>
        ) : (
          <h2>ADD PRODUCT</h2>
        )}
        <form onSubmit={selectedProduct ? handleUpdateProduct : handleFormSubmit}>
          <div>
            <label>Product Name:</label>
            <input
              type="text"
              placeholder="Enter Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div>
            <label>Brand:</label>
            <input
              type="text"
              placeholder="Enter Product Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
          <div>
            <label>Category:</label>
            <input
              type="text"
              placeholder="Enter Product Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              placeholder="Enter Product Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="1"

            />
          </div>
          <div>
            <label>Quantity:</label>
            <input
              type="number"
              placeholder="Enter Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"

            />
          </div>
          <button type="submit">
            {selectedProduct ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>
      <div>
        {data.length > 0 && (
          <table className="user-table">
            <thead>
              <tr>
                <th>🛍️ Product Name</th>
                <th>◼️ Brand</th>
                <th>💲Price</th>
                <th>🔢Quantity</th>
                <th>⚙️ Delete</th>
                <th>🔧 Update</th>
              </tr>
            </thead>
            <tbody>
              {data.map(function (item, index) {
                return (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>{item.brand}</td>
                    <td>{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <button onClick={() => deleteProduct(item._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleUpdateClick(item)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default UserHome;
