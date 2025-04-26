import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const RoomForm = ({ show, onHide, onSave, paymentTypes }) => {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    tenantName: '',
    phoneNumber: '',
    startDate: '',
    paymentType: '',
    notes: ''
  });
  
  // Set today's date as min date for the form
  const today = new Date().toISOString().split('T')[0];
  
  // Fallback payment types if API fails
  const defaultPaymentTypes = [
    { _id: 'monthly', name: 'Theo tháng' },
    { _id: 'quarterly', name: 'Theo quý' }, 
    { _id: 'yearly', name: 'Theo năm' }
  ];

  // Use API payment types if available, otherwise use defaults
  const availablePaymentTypes = paymentTypes && paymentTypes.length > 0 ? paymentTypes : defaultPaymentTypes;
  
  useEffect(() => {
    console.log("Payment types in form:", paymentTypes);
  }, [paymentTypes]);
  
  // Reset form when modal closes
  const handleClose = () => {
    setFormData({
      tenantName: '',
      phoneNumber: '',
      startDate: '',
      paymentType: '',
      notes: ''
    });
    setValidated(false);
    onHide();
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Format date from yyyy-mm-dd to Date object
  const formatDate = (dateString) => {
    if (!dateString) return new Date();
    return new Date(dateString);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    
    // Check if form is valid
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Format date before sending to API
    const formattedData = {
      ...formData,
      startDate: formatDate(formData.startDate)
    };
    
    console.log("Form data to be sent:", formattedData);
    onSave(formattedData);
  };
  
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Thông Tin Thuê Trọ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="tenantName" className="mb-3">
              <Form.Label className="required">Tên người thuê trọ</Form.Label>
              <Form.Control
                type="text"
                name="tenantName"
                value={formData.tenantName}
                onChange={handleChange}
                required
                minLength={5}
                maxLength={50}
              />
              <Form.Control.Feedback type="invalid">
                Tên phải từ 5-50 ký tự và không chứa số hoặc ký tự đặc biệt
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group as={Col} md="6" controlId="phoneNumber" className="mb-3">
              <Form.Label className="required">Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                pattern="^\d{10}$"
              />
              <Form.Control.Feedback type="invalid">
                Số điện thoại phải có 10 chữ số
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="startDate" className="mb-3">
              <Form.Label className="required">Ngày bắt đầu thuê trọ</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                min={today}
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng chọn ngày bắt đầu thuê. Ngày phải từ hôm nay trở đi.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group as={Col} md="6" controlId="paymentType" className="mb-3">
              <Form.Label className="required">Hình thức thanh toán</Form.Label>
              <Form.Select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                required
              >
                <option value="">Chọn hình thức thanh toán</option>
                {availablePaymentTypes.map(type => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Vui lòng chọn hình thức thanh toán
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          
          <Form.Group className="mb-3" controlId="notes">
            <Form.Label>Ghi chú</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </Form.Group>
          
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Tạo mới
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RoomForm; 