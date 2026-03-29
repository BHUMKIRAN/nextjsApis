import React from 'react'

const page = () => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  return (
    <div>page</div>
  )
}

export default page