import React, { useState, useEffect } from 'react';
import { Container, Navbar } from 'react-bootstrap';
import RoomList from './components/RoomList';
import RoomForm from './components/RoomForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import axios from 'axios';

function App() {
  const [rooms, setRooms] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch rooms and payment types on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        // Initialize payment types if they don't exist
        await axios.post('http://localhost:5000/api/payment-types/init');
        
        // Fetch payment types
        const paymentTypesResponse = await axios.get('http://localhost:5000/api/payment-types');
        console.log('Payment Types from API:', paymentTypesResponse.data);
        setPaymentTypes(paymentTypesResponse.data);
        
        // Fetch rooms
        const roomsResponse = await axios.get('http://localhost:5000/api/rooms');
        setRooms(roomsResponse.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle search
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/rooms?search=${term}`);
      setRooms(response.data);
    } catch (error) {
      console.error('Error searching rooms:', error);
    }
  };

  // Handle create new room
  const handleCreateRoom = async (roomData) => {
    try {
      console.log("Sending data to server:", roomData);
      const response = await axios.post('http://localhost:5000/api/rooms', roomData);
      setRooms([...rooms, response.data]);
      setShowRoomForm(false);
    } catch (error) {
      console.error('Error creating room:', error);
      if (error.response && error.response.data) {
        console.error('Error details from server:', error.response.data);
        alert(`Lỗi: ${error.response.data.message || 'Không thể tạo phòng'}`);
      } else {
        alert('Lỗi kết nối hoặc máy chủ không khả dụng');
      }
    }
  };

  // Handle delete rooms
  const handleDeleteRooms = async () => {
    try {
      await axios.delete('http://localhost:5000/api/rooms', { data: { ids: selectedRooms } });
      setRooms(rooms.filter(room => !selectedRooms.includes(room._id)));
      setSelectedRooms([]);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting rooms:', error);
      alert('Lỗi khi xóa phòng');
    }
  };

  // Toggle room selection
  const toggleRoomSelection = (roomId) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter(id => id !== roomId));
    } else {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  // Handle select all rooms
  const toggleSelectAll = () => {
    if (selectedRooms.length === rooms.length) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms(rooms.map(room => room._id));
    }
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Hệ Thống Quản Lý Thuê Phòng Trọ</Navbar.Brand>
        </Container>
      </Navbar>
      
      <Container className="app-container">
        <RoomList 
          rooms={rooms}
          isLoading={isLoading}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          selectedRooms={selectedRooms}
          toggleRoomSelection={toggleRoomSelection}
          toggleSelectAll={toggleSelectAll}
          onCreateClick={() => setShowRoomForm(true)}
          onDeleteClick={() => setShowDeleteConfirmation(true)}
        />
        
        <RoomForm 
          show={showRoomForm}
          onHide={() => setShowRoomForm(false)}
          onSave={handleCreateRoom}
          paymentTypes={paymentTypes}
        />
        
        <DeleteConfirmation 
          show={showDeleteConfirmation}
          onHide={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeleteRooms}
          selectedRooms={selectedRooms}
          rooms={rooms}
        />
      </Container>
    </div>
  );
}

export default App; 