import React from 'react';
import { Table, Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import { FaSearch, FaPlus, FaTrash } from 'react-icons/fa';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
};

const RoomList = ({ 
  rooms, 
  isLoading,
  searchTerm, 
  handleSearch, 
  selectedRooms, 
  toggleRoomSelection, 
  toggleSelectAll, 
  onCreateClick, 
  onDeleteClick 
}) => {
  return (
    <div className="table-container">
      <div className="search-bar">
        <InputGroup>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Tìm kiếm theo mã phòng, tên người thuê hoặc số điện thoại"
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>
      </div>

      <div className="table-header">
        <h2>Danh sách phòng trọ</h2>
        <div className="action-buttons">
          <Button variant="primary" onClick={onCreateClick}>
            <FaPlus /> Tạo mới
          </Button>
          <Button 
            variant="danger" 
            onClick={onDeleteClick} 
            disabled={selectedRooms.length === 0}
          >
            <FaTrash /> Xóa
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {rooms.length === 0 ? (
            <div className="empty-state">
              <p>Không có dữ liệu phòng trọ</p>
              <Button variant="primary" onClick={onCreateClick}>
                <FaPlus /> Tạo mới phòng trọ
              </Button>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="checkbox-column">
                    <Form.Check
                      type="checkbox"
                      checked={selectedRooms.length === rooms.length && rooms.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>STT</th>
                  <th>Mã phòng trọ</th>
                  <th>Tên người thuê trọ</th>
                  <th>Số điện thoại</th>
                  <th>Ngày bắt đầu thuê trọ</th>
                  <th>Hình thức thanh toán</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room, index) => (
                  <tr key={room._id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedRooms.includes(room._id)}
                        onChange={() => toggleRoomSelection(room._id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{room.roomCode}</td>
                    <td>{room.tenantName}</td>
                    <td>{room.phoneNumber}</td>
                    <td>{formatDate(room.startDate)}</td>
                    <td>{room.paymentType?.name}</td>
                    <td>{room.notes}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </div>
  );
};

export default RoomList; 