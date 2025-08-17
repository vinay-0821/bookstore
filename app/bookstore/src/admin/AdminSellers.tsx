import React, { useEffect, useState } from 'react';
import './css/AdminCustomers.css';
import AdminNavbar from './AdminNavbar';
import debounce from 'lodash.debounce';
import { fetchSellers } from '../services/adminapis';

interface Seller {
  id: number;
  name: string;
  email: string;
  mobile: string;
  // books_added: [];
  amount_received: number;
  registration_date: string;
}

export default function AdminCustomers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'amount' | 'regdate'>('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSellers(sortBy, order, search);

        console.log(data);

        const formattedData = data.map((item: any) => ({
          id: item.userid,
          name: item.name,
          email: item.email,
          mobile: item.phoneNo, 
          amount_received: item.amount_received || 0,
          registration_date: new Date(item.join_date).toLocaleDateString(),
        }));

        setSellers(formattedData);
      }
      catch(err) {
        console.log('Error fetchinng sellers:', err);
      }
    };

    const debouncedFetch = debounce(fetchData, 500);
    debouncedFetch();
    // console.log("this is user", customers);
    return () => debouncedFetch.cancel();
  }, [sortBy, order, search]);

  const handleSort = (column: 'name' | 'email' | 'amount' | 'regdate') => {
    if (sortBy === column) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setOrder('asc');
    }
  };

  return (
    <div className="admin-customers-page">
      <AdminNavbar />
      <div className='admin-customers-container'>
        <h2>All sellers</h2>
        <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
        />

        <table className="customer-table">
            <thead>
            <tr>
                <th onClick={() => handleSort('name')}>
                  Name {sortBy === 'name' && (order === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('email')}>
                  Email {sortBy === 'email' && (order === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('amount')}>
                  Amount Received {sortBy === 'amount' && (order === 'asc' ? '↑' : '↓')}
                </th>
                <th>Mobile</th>
                
                <th onClick={() => handleSort('regdate')}>
                  Registration Date {sortBy === 'regdate' && (order === 'asc' ? '↑' : '↓')}
                </th>
            </tr>
            </thead>
            <tbody>
            {sellers.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.amount_received}</td>
                  <td>{c.mobile}</td>
                  <td>{c.registration_date}</td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
