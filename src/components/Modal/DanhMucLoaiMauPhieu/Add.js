import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker } from 'antd';
import moment from 'moment';
const AddEditModal = ({ isVisible, onCancel, onFinish, initialValues, modalMode }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (modalMode === 'edit' && initialValues) {
      const initialYear = initialValues.GhiChu ? moment(initialValues.GhiChu, 'YYYY') : null;
      form.setFieldsValue({
        TenLoaiMauPhieu: initialValues.TenLoaiMauPhieu,
        MaLoaiMauPhieu: initialValues.MaLoaiMauPhieu,
        GhiChu: initialYear,
        LoaiMauPhieuID: initialValues.LoaiMauPhieuID // Ensure correct field name
      });
    } else {
      form.resetFields(); // Reset fields when switching between add and edit modes
    }
  }, [initialValues, modalMode, form]);

  const handleFinish = (values) => {
    // Convert GhiChu back to a year string if it's a moment object
    if (values.GhiChu) {
      values.GhiChu = values.GhiChu.format('YYYY');
    }

    // Ensure correct ID is set for edit mode
    if (modalMode === 'edit' && initialValues?.LoaiMauPhieuID) {
      values.LoaiMauPhieuID = initialValues.LoaiMauPhieuID;
    }

    // Check if onFinish is a function before calling
    if (typeof onFinish === 'function') {
      onFinish(values); // Call onFinish with form values
    } else {
      console.error('onFinish is not a function');
    }
  };

  return (
    <Modal
      title={`${modalMode === 'add' ? 'Thêm' : 'Sửa'} thông tin loại mẫu phiếu`}
      visible={isVisible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
      >
        <Form.Item
          name="MaLoaiMauPhieu"
          label="Mã Loại Mẫu Phiếu"
          rules={[{ required: true, message: 'Vui lòng nhập tên loại mẫu phiếu!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="TenLoaiMauPhieu"
          label="Tên Loại Mẫu Phiếu"
          rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="GhiChu"
          label="Năm"
          rules={[{ required: true, message: 'Vui lòng chọn năm!' }]}
        >
          <DatePicker 
            picker="year"
            format="YYYY"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {modalMode === 'add' ? 'Thêm' : 'Cập nhật'}
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            onClick={onCancel}
          >
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
