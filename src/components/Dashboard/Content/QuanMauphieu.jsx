import React, { useState, useEffect } from 'react';
import { Button, Layout, Table, Input, Select, message, DatePicker, Modal, Form } from 'antd';
import { EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import '../../../assets/css/Nguoidung.css';
import axiosInstance from '../../../utils/axiosInstance';
const { Content } = Layout;
const { Search } = Input;
const Nguoidung = () => {
  const [selectedCriteriaFields, setSelectedCriteriaFields] = useState([]);
  const [isAddIndicatorModalVisible, setIsAddIndicatorModalVisible] = useState(false); // Modal cho thêm chỉ tiêu
  const [chiTieuList, setChiTieuList] = useState([]); // Danh sách chỉ tiêu
  const [fieldValues, setFieldValues] = useState({}); // State to hold input values
  const [dataSource, setDataSource] = useState([]);
  const [loaiMauPhieuList, setLoaiMauPhieuList] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchLoaiMauPhieu, setSearchLoaiMauPhieu] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddFieldModalVisible, setIsAddFieldModalVisible] = useState(false);
  const [isAddbaocaocuoi, setIsAddbaocaocuoi] = useState(false);
  const [selectbaocaocuoi, setSelectetbaocaocuoi] = useState([]);
  const [isAddCriteriaModalVisible, setIsAddCriteriaModalVisible] = useState(false); // State for criteria modal
  const [form] = Form.useForm();
  const [criteriaOptions, setCriteriaOptions] = useState([]);
  const [addFieldForm] = Form.useForm();
  // State to hold selected fields
  const [selectedFields, setSelectedFields] = useState([]);
  const handleAddCriteria = () => {
    setIsAddCriteriaModalVisible(true); // Mở modal thêm trường thông tin
  };
  const handleSaveCriteria = () => {
    addFieldForm
      .validateFields()
      .then((values) => {
        const selectedFields = values.criteriaFields.map(id =>
          criteriaOptions.find(option => option.TieuChiID === id)
        ).filter(Boolean); // Loại bỏ giá trị null nếu có
  
        if (selectedFields.length > 0) {
          setSelectedCriteriaFields(prevFields => [...prevFields, ...selectedFields]);
        }
  
        // Đóng modal và reset form
        setIsAddCriteriaModalVisible(false);
        addFieldForm.resetFields();
      })
      .catch((info) => console.log("Validation Failed:", info));
  };
  
  
  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', align: 'center' },
    { title: 'Tên mẫu phiếu', dataIndex: 'TenMauPhieu', key: 'TenMauPhieu', align: 'left' },
    { title: 'Loại mẫu phiếu', dataIndex: 'LoaiMauPhieuID', key: 'LoaiMauPhieuID', align: 'left' },
    { title: 'Mã mẫu phiếu', dataIndex: 'MaMauPhieu', key: 'MaMauPhieu', align: 'left' },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <span>
          <Button type="link" style={{ color: 'black', fontSize: '20px' }}>
            <EditOutlined />
          </Button>
          <Button
            type="link"
            danger
            style={{ color: 'black', fontSize: '20px' }}
            onClick={() => handleDelete(record.key)}
          >
            <DeleteOutlined />
          </Button>
          <Button type="link" danger style={{ color: 'black', fontSize: '20px' }}>
            <DownloadOutlined />
          </Button>
        </span>
      ),
    },
  ];
  const handleAddField1 = (values) => {
    setSelectetbaocaocuoi(values.fieldName);
    setIsAddbaocaocuoi(false);
    addFieldForm.resetFields();
  };
  useEffect(() => {
    const fetchLoaiMauPhieu = async () => {
      try {
        const response = await axiosInstance.get('/v1/DanhMucLoaiMauPhieu/DanhSachLoaiMauPhieu?pageNumber=1&pageSize=20');
        if (response.data.status === 1) {
          setLoaiMauPhieuList(response.data.data);
        } else {
          message.error('Không thể lấy dữ liệu Loại Mẫu Phiếu');
        }
      } catch (err) {
        message.error('Lỗi khi lấy dữ liệu: ' + err.message);
      }
    };
    const fetchCriteriaData = async () => {
      try {
        const response = await axiosInstance.get('/v1/DanhMucTieuChi/DanhSachTieuChi');
        if (response.data.status === 1) {
          setCriteriaOptions(response.data.data);
        } else {
          message.error('Không thể lấy dữ liệu tiêu chí');
        }
      } catch (error) {
        message.error('Lỗi khi lấy dữ liệu tiêu chí: ' + error.message);
      }
    };
  
    
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/RpMauPhieu/List?pageNumber=1&pageSize=20');
        if (response.data.Status === 1) {
          const formattedData = response.data.Data.map((item, index) => ({
            key: item.MauPhieuID,
            stt: index + 1,
            TenMauPhieu: item.TenMauPhieu,
            LoaiMauPhieuID: item.LoaiMauPhieuID,
            MaMauPhieu: item.MaMauPhieu,
          }));
          setDataSource(formattedData);
        } else {
          message.error(response.data.Message || 'Không thể lấy dữ liệu');
        }
      } catch (err) {
        message.error('Lỗi khi lấy dữ liệu: ' + err.message);
      }
    };
    const fetchChiTieuData = async () => {
      try {
        const response = await axiosInstance.get('/v1/DanhMucChiTieu/DanhSachChiTieu');
        if (response.data.status === 1) {
          setChiTieuList(response.data.data);
        } else {
          message.error('Không thể lấy dữ liệu chỉ tiêu');
        }
      } catch (error) {
        message.error('Lỗi khi lấy dữ liệu chỉ tiêu: ' + error.message);
      }
    };
    fetchChiTieuData();
    fetchCriteriaData();
    fetchLoaiMauPhieu();
    fetchData();
    
  }, []);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Xóa dữ liệu',
      content: 'Bạn có muốn xóa mẫu phiếu này không?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        try {
          const response = await axiosInstance.post(`/RpMauPhieu/Delete?id=${id}`);
          if (response.data.status === 1) {
            message.success('Xóa thành công!');
            setDataSource(dataSource.filter(item => item.key !== id));
          } else {
            message.error(response.data.Message || 'Xóa thất bại!');
          }
        } catch (err) {
          message.error('Lỗi khi xóa: ' + err.message);
        }
      },
    });
  };
  const handleAdd = async (values) => {
    try {
      const response = await axiosInstance.post('/RpMauPhieu/Insert', {
        LoaiMauPhieuID: values.LoaiMauPhieuID,
        TenMauPhieu: values.TenMauPhieu,
        MaMauPhieu: values.MaMauPhieu,
      });
      if (response.data.status === 1) {
        message.success('Thêm mới thành công!');
        setDataSource((prevData) => [
          ...prevData,
          {
            key: response.data.data.MauPhieuID,
            ...values,
          },
        ]);
        setIsModalVisible(false);
        form.resetFields();
      } else {
        message.error(response.data.message || 'Thêm mới thất bại');
      }
    } catch (error) {
      message.error('Lỗi khi thêm mới: ' + error.response?.data?.message || error.message);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  const handleAddField = (values) => {
    // Handle adding fields logic here
    setIsAddFieldModalVisible(false);
    addFieldForm.resetFields();
  };
  const handleInputChange = (field, value) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };
  const handleAddIndicator = () => {
    setIsAddIndicatorModalVisible(true); // Mở modal thêm chỉ tiêu
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid #ccc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ fontSize: 19 }}>QUẢN LÝ MẪU PHIẾU</h1>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Thêm
          </Button>
        </div>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <DatePicker picker="year" />
          <Select
            allowClear
            placeholder="Loại mẫu phiếu"
            style={{ width: 300 }}
            value={searchLoaiMauPhieu}
            onChange={value => setSearchLoaiMauPhieu(value)}
            options={loaiMauPhieuList.map(item => ({
              value: item.LoaiMauPhieuID,
              label: item.TenLoaiMauPhieu,
            }))}
          />
          <Search
            placeholder="Tìm kiếm theo tên"
            allowClear
            value={searchName}
            onSearch={setSearchName}
            onChange={e => setSearchName(e.target.value)}
            style={{ width: 200 }}
          />
        </div>
        <Table
          className="custom-table"
          dataSource={dataSource.filter(item => 
            item.TenMauPhieu.toLowerCase().includes(searchName.toLowerCase()) &&
            (searchLoaiMauPhieu ? item.LoaiMauPhieuID === searchLoaiMauPhieu : true)
          )}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
<Modal
  title="Thêm mẫu phiếu"
  visible={isModalVisible}
  onCancel={handleCancel}
  footer={null}
  width={10000} // Thay đổi chiều rộng modal
>
  <div style={{ display: 'flex' }}>
    {/* Bên trái: Form */}
    <div style={{ flex: 1, paddingRight: '20px' }}>
      <Form
        form={form}
        onFinish={handleAdd}
        labelCol={{ span: 24 }} // Full width for label
        wrapperCol={{ span: 24 }} // Full width for input
      >
        <Form.Item name="LoaiMauPhieuID" label="Loại mẫu phiếu" rules={[{ required: true }]}>
          <Select placeholder="Select a LoaiMauPhieuID" style={{ width: '100%' }} options={loaiMauPhieuList.map(item => ({ value: item.LoaiMauPhieuID, label: item.TenLoaiMauPhieu }))} />
        </Form.Item>
        <Form.Item name="TenMauPhieu" label="Tên mẫu phiếu" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="MaMauPhieu" label="Mã mẫu phiếu" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <div style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'auto' }}>
          {/* Phần đầu báo cáo */}
          <div style={{ width: '100%', margin: '20px 0', border: '1px solid rgb(173, 170, 170)', padding: '10px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Phần đầu báo cáo</h3>
              <Button type="primary" onClick={() => setIsAddFieldModalVisible(true)}>Thêm trường</Button>
            </div>
            <p>Các trường thông tin</p>
            {selectedFields.map((field, index) => (
              <div key={index} style={{ marginTop: '10px' }}>
                <span>{field}</span>
                <Input
                placeholder={`Nhập ${field}`}
                style={{ marginLeft: '10px', width: '200px' }}
                onChange={(e) => handleInputChange(field, e.target.value)} // Update field value on change
              />
              </div>
            ))}
          </div>

          {/* Phần tiêu chí */}
          <div style={{ width: '100%', margin: '20px 0', border: '1px solid rgb(173, 170, 170)', padding: '10px', borderRadius: '4px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h3 style={{ margin: 0 }}>Phần tiêu chí</h3>
    <Button type="primary" onClick={handleAddCriteria}>Thêm trường</Button>
  </div>
  <p>Các trường thông tin</p>

  {selectedCriteriaFields.length > 0 ? (
    selectedCriteriaFields.map((field, index) => (
      <Input key={index} value={field.TenTieuChi} readOnly style={{ marginBottom: "8px" }} />
    ))
  ) : (
    <p>Chưa có tiêu chí nào được chọn.</p>
  )}
</div>
          {/* Phần chỉ tiêu */}
          <div style={{ width: '100%', margin: '20px 0', border: '1px solid rgb(173, 170, 170)', padding: '10px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Phần chỉ tiêu</h3>
              <Button type="primary" onClick={handleAddIndicator}>Thêm trường</Button>
            </div>
            <p>Các trường thông tin</p>
            {/* Thêm các trường thông tin cho phần chỉ tiêu ở đây */}
          </div>

          {/* Phần cuối báo cáo */}
          <div style={{ width: '100%', margin: '20px 0', border: '1px solid rgb(173, 170, 170)', padding: '10px', borderRadius: '4px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h3 style={{ margin: 0 }}>Phần cuối báo cáo</h3>
    <Button type="primary" onClick={() => setIsAddbaocaocuoi(true)}>Thêm trường</Button>
  </div>
  <p>Các trường thông tin</p>
  
  {/* Hiển thị các trường đã chọn kèm ô nhập liệu */}
  {selectbaocaocuoi.map((field, index) => (
    <div key={index} style={{ marginTop: '10px' }}>
      <span>{field}</span>
      <Input 
        placeholder={`Nhập ${field}`} 
        style={{ marginLeft: '10px', width: '200px' }}
        value={fieldValues[field] || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
      />
    </div>
  ))}
</div>
        </div>
      </Form>
    </div>
    {/* Bên phải: Nội dung khác */}
    <div style={{ flex: 1, marginLeft: '20px' }}>
      <div style={{ width: '100%', margin: '20px 0', border: '1px solid rgb(173, 170, 170)', padding: '10px', borderRadius: '4px' }}>
      <p>{fieldValues["Đơn vị chủ quản"] || ''}</p>
          <p>{fieldValues["Quốc hiệu tiêu ngữ"] || ''}</p>
          <p>{fieldValues["Tiêu đề báo cáo"] || ''}</p>
          <div style={{ width: '100%', margin: '20px 0', border: '1px solid rgb(173, 170, 170)', padding: '10px', borderRadius: '4px' }}>
  <h2>MẪU PHIẾU</h2> {/* Tiêu đề */}

  {selectedCriteriaFields.length > 0 ? (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {selectedCriteriaFields.map((field, index) => (
        <div key={index} style={{ fontWeight: "bold", padding: "5px 10px", background: "#f0f0f0", borderRadius: "4px" }}>
          {field.TenTieuChi}
        </div>
      ))}
    </div>
  ) : (
    <p><strong>Chưa có tiêu chí nào được chọn.</strong></p>
  )}
</div>


          <p>{fieldValues["Lưu Nhận"] || ''}</p>
          <p>{fieldValues["Ngày Tháng"] || ''}</p>
        {/* Thêm các trường thông tin khác ở đây */}
      </div>
    </div>
  </div>
  <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
              Lưu
            </Button>
            <Button type="default" onClick={handleCancel}>
              Hủy
            </Button>
          </div>
        </Form.Item>
</Modal>
<Modal
  title="Thêm trường thông tin"
  visible={isAddFieldModalVisible}
  onCancel={() => setIsAddFieldModalVisible(false)}
  footer={[
    <Button key="cancel" onClick={() => setIsAddFieldModalVisible(false)}>
      Hủy
    </Button>,
    <Button
      key="submit"
      type="primary"
      onClick={() => {
        addFieldForm
          .validateFields()
          .then((values) => {
            handleAddField(values);
          })
          .catch((info) => console.log("Validation Failed:", info));
      }}
    >
      Lưu
    </Button>,
  ]}
>
  <Form
    form={addFieldForm}
    onFinish={handleAddField}
  >
    <Form.Item
      name="fieldName"
      label="Trường thông tin"
      rules={[{ required: true, message: "Vui lòng chọn ít nhất một trường thông tin" }]}
    >
      <Select
        mode="multiple"
        placeholder="Chọn các trường thông tin"
        allowClear
        value={selectedFields} // Set the selected fields as the value
        onChange={(value) => {
          // Update selected fields on change
          setSelectedFields(value);
        }}
      >
        <Select.Option value="Đơn vị chủ quản" disabled={selectedFields.includes("Đơn vị chủ quản")}>
          Đơn vị chủ quản
        </Select.Option>
        <Select.Option value="Quốc hiệu tiêu ngữ" disabled={selectedFields.includes("Quốc hiệu tiêu ngữ")}>
          Quốc hiệu tiêu ngữ
        </Select.Option>
        <Select.Option value="Tiêu đề báo cáo" disabled={selectedFields.includes("Tiêu đề báo cáo")}>
          Tiêu đề báo cáo
        </Select.Option>
      </Select>
    </Form.Item>
  </Form>
</Modal>
<Modal
  title="Thêm trường thông tin"
  visible={isAddbaocaocuoi}
  onCancel={() => setIsAddbaocaocuoi(false)}
  footer={[
    <Button key="cancel" onClick={() => setIsAddbaocaocuoi(false)}>
      Hủy
    </Button>,
    <Button
      key="submit"
      type="primary"
      onClick={() => {
        addFieldForm
          .validateFields()
          .then((values) => {
            handleAddField1(values);
          })
          .catch((info) => console.log("Validation Failed:", info));
      }}
    >
      Lưu
    </Button>,
  ]}
>
  <Form
    form={addFieldForm}
    onFinish={handleAddField1}
  >
    <Form.Item
      name="fieldName"
      label="Trường thông tin"
      rules={[{ required: true, message: "Vui lòng chọn ít nhất một trường thông tin" }]}
    >
      <Select
        mode="multiple"
        placeholder="Chọn các trường thông tin"
        allowClear
        value={selectbaocaocuoi}
        onChange={(value) => {
          setSelectetbaocaocuoi(value);
        }}
      >
        <Select.Option value="Lưu Nhận" disabled={selectbaocaocuoi.includes("Lưu Nhận")}>
          Lưu Nhận
        </Select.Option>
        <Select.Option value="Ngày Tháng" disabled={selectbaocaocuoi.includes("Ngày Tháng")}>
          Ngày Tháng
        </Select.Option>
      </Select>
    </Form.Item>
  </Form>
</Modal>

<Modal
  title="Thêm trường thông tin cho phần tiêu chí"
  visible={isAddCriteriaModalVisible}
  onCancel={() => setIsAddCriteriaModalVisible(false)}
  footer={[
    <Button key="cancel" onClick={() => setIsAddCriteriaModalVisible(false)}>Hủy</Button>,
    <Button key="submit" type="primary" onClick={handleSaveCriteria}>Lưu</Button>,
  ]}
>
  <Form form={addFieldForm}>
  <Form.Item
  name="criteriaFields"
  label="Trường thông tin"
  rules={[{ required: true, message: "Vui lòng chọn ít nhất một trường thông tin" }]}
>
  <Select
    mode="multiple" // Cho phép chọn nhiều tiêu chí
    placeholder="Chọn trường thông tin"
    style={{ width: '100%' }}
  >
    {criteriaOptions
      .filter(option => !selectedCriteriaFields.some(field => field.TieuChiID === option.TieuChiID)) // Lọc bỏ tiêu chí đã chọn
      .map(option => (
        <Select.Option key={option.TieuChiID} value={option.TieuChiID}>
          {option.TenTieuChi}
        </Select.Option>
      ))}
  </Select>
</Form.Item>
  </Form>
</Modal>

<Modal
  title="Thêm chỉ tiêu"
  visible={isAddIndicatorModalVisible}
  onCancel={() => setIsAddIndicatorModalVisible(false)}
  footer={[
    <Button key="cancel" onClick={() => setIsAddIndicatorModalVisible(false)}>
      Hủy
    </Button>,
    <Button
      key="submit"
      type="primary"
      onClick={() => {
        // Xử lý thêm chỉ tiêu logic ở đây
        setIsAddIndicatorModalVisible(false);
      }}
    >
      Lưu
    </Button>,
  ]}
>
  <Form form={addFieldForm}>
    <Form.Item
      name="indicatorField"
      label="Chỉ tiêu"
      rules={[{ required: true, message: "Vui lòng chọn ít nhất một chỉ tiêu" }]}
    >
      <Select
        placeholder="Chọn chỉ tiêu"
        options={chiTieuList.map(item => ({
          value: item.ChiTieuID,
          label: item.TenChiTieu,
        }))}
      />
    </Form.Item>
  </Form>
</Modal>
      </Content>
    </Layout>
  );
};

export default Nguoidung;