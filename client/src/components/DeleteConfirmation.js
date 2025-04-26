import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteConfirmation = ({ show, onHide, onConfirm, selectedRooms, rooms }) => {
  // Get room codes of selected rooms
  const getSelectedRoomCodes = () => {
    const selectedRoomData = rooms.filter(room => selectedRooms.includes(room._id));
    return selectedRoomData.map(room => room.roomCode).join(', ');
  };
  
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xóa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Xóa nhanh</h5>
        <p>
          Bạn có muốn xóa thông tin thuê trọ {getSelectedRoomCodes()} hay không?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Không
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Có
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmation;