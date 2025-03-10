import Draggable from "react-draggable";
import React, { useState, useEffect } from 'react';
import { Button, Layout, Table, Input, Select, message, DatePicker, Modal, Card } from 'antd';
import { EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import '../../../assets/css/Nguoidung.css';
import axiosInstance from '../../../utils/axiosInstance';
const { Option } = Select;
const { Content } = Layout;
const { Search } = Input;
const Nguoidung = () => {
  const [isModalbaocao, setIsModalbaocao] = useState(false);
  const [selectedbaocao, setSelectedbaocao] = useState([]);
  const [cardFields, setCardFields] = useState([]);
  const [isAddIndicatorFieldModalVisible, setIsAddIndicatorFieldModalVisible] = useState(false);
  const [criteriaFieldValues, setCriteriaFieldValues] = useState({}); // State to hold input values for criteria
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedCriteriaFields, setSelectedCriteriaFields] = useState([]); // State for criteria fields
  const [isAddFieldModalVisible, setIsAddFieldModalVisible] = useState(false);
  const [isAddCriteriaFieldModalVisible, setIsAddCriteriaFieldModalVisible] = useState(false); // Modal state for criteria
  const [dataSource, setDataSource] = useState([]);
  const [loaiMauPhieuList, setLoaiMauPhieuList] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchLoaiMauPhieu, setSearchLoaiMauPhieu] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null); // Store the record to delete
  const [selectedIndicatorFields, setSelectedIndicatorFields] = useState([]); // State for selected indicator fields
  const [inputValues, setInputValues] = useState({}); // State to hold input values for selected fields

  // màn báo cáo
  const handleFieldSelect = (value) => {
    setSelectedFields(value);
    // Initialize input values for selected fields
    const newInputValues = {};
    value.forEach(field => {
      if (!inputValues[field]) {
        newInputValues[field] = ''; // Initialize with empty string
      }
    });
    setInputValues(prev => ({ ...prev, ...newInputValues }));
  };
  const handleInputChange = (field, value) => {
    setInputValues(prev => ({ ...prev, [field]: value }));
  };
 // màn tiêu chí
  const handleCriteriaFieldSelect = (value) => {
    setSelectedCriteriaFields(value); // Handle selection for criteria fields
    // Initialize input values for selected criteria
    const newCriteriaFieldValues = {};
    value.forEach(field => {
      if (!criteriaFieldValues[field]) {
        newCriteriaFieldValues[field] = ''; // Initialize with empty string
      }
    });
    setCriteriaFieldValues(prev => ({ ...prev, ...newCriteriaFieldValues }));
  };
  // màn chỉ tiêu 
  const handleIndicatorFieldSelect = (value) => {
    // Update selected indicator fields
    setSelectedIndicatorFields(value);
  
    // Initialize input values for selected indicator fields
    const newIndicatorFieldValues = {};
    value.forEach(field => {
      if (!criteriaFieldValues[field]) { // You might want to use a different state for indicator field values
        newIndicatorFieldValues[field] = ''; // Initialize with empty string
      }
    });
  
    // Assuming you want to keep track of indicator field values separately
    setCriteriaFieldValues(prev => ({ ...prev, ...newIndicatorFieldValues }));
  };
  
  const handleAddField = () => {
    setIsAddFieldModalVisible(true);
  }
  // màn bóa cáo cuối

  const handleAddReport = () => {
    // Update the card fields with the selected fields
    setCardFields(selectedbaocao);
    setIsModalbaocao(false); // Close the modal
  };
  const handleSelectbaocao = (value) => {
    setSelectedbaocao(value);
    // Initialize input values for selected fields
    const newInputValues = {};
    value.forEach(field => {
      if (!inputValues[field]) {
        newInputValues[field] = ''; // Initialize with empty string
      }
    });
    setInputValues(prev => ({ ...prev, ...newInputValues }));
  };
  const handleInputChange1 = (field, value) => {
    setInputValues(prev => ({ ...prev, [field]: value }));
  };
  const handleAddReport1 = () => {
    // Update the card fields with the selected fields
    setCardFields(selectedbaocao);
    setIsModalbaocao(false); // Close the modal
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
            onClick={() => {
              setRecordToDelete(record.key); // Set the record to delete
              setDeleteModalVisible(true); // Show delete confirmation modal
            }}
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loaiMauPhieuResponse, dataResponse] = await Promise.all([
          axiosInstance.get('/v1/DanhMucLoaiMauPhieu/DanhSachLoaiMauPhieu?pageNumber=1&pageSize=20'),
          axiosInstance.get('/RpMauPhieu/List?pageNumber=1&pageSize=20'),
        ]);

        if (loaiMauPhieuResponse.data.status === 1) {
          setLoaiMauPhieuList(loaiMauPhieuResponse.data.data);
        } else {
          message.error('Không thể lấy dữ liệu Loại Mẫu Phiếu');
        }

        if (dataResponse.data.Status === 1) {
          const formattedData = dataResponse.data.Data.map((item, index) => ({
            key: item.MauPhieuID,
            stt: index + 1,
            TenMauPhieu: item.TenMauPhieu,
            LoaiMauPhieuID: item.LoaiMauPhieuID,
            MaMauPhieu: item.MaMauPhieu,
          }));
          setDataSource(formattedData);
        } else {
          message.error(dataResponse.data.Message || 'Không thể lấy dữ liệu');
        }
      } catch (err) {
        message.error('Lỗi khi lấy dữ liệu: ' + err.message);
      }
    };

    fetchData();
  }, []);
  const handleDelete = async () => {
    try {
      const response = await axiosInstance.post(`/RpMauPhieu/Delete?id=${recordToDelete}`);
      if (response.data.status === 1) {
        message.success('Xóa thành công!');
        setDataSource(dataSource.filter(item => item.key !== recordToDelete));
      } else {
        message.error(response.data.Message || 'Xóa thất bại!');
      }
    } catch (err) {
      message.error('Lỗi khi xóa: ' + err.message);
    } finally {
      setDeleteModalVisible(false); // Close the modal after deletion
    }
  };
  const Luu = () => {
    setIsModalVisible(false);
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid #ccc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 className="text-2xl font-bold mb-6 text-center">QUẢN LÝ MẪU PHIẾU</h1>
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
        {/* Add New Record Modal */}
        <Modal
          title="Thêm mới mẫu phiếu"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Hủy
            </Button>,
            <Button key="save" type="primary" onClick={() => Luu()}>
              Lưu
            </Button>,
          ]}
          width={10000}
          modalRender={(modal) => <Draggable>{modal}</Draggable>} 
        >
          <div className="flex gap-4">
            {/* Left Column */}
            <div className="flex-1">
              {/* Loại mẫu phiếu */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Loại mẫu phiếu <span className="text-red-500">*</span>
                </label>
                <Select 
                  placeholder="Chọn loại mẫu phiếu" 
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm"
                >
                  {loaiMauPhieuList.map(item => (
                    <Option key={item.LoaiMauPhieuID} value={item.LoaiMauPhieuID}>
                      {item.TenLoaiMauPhieu}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Tên biểu mẫu */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tên biểu mẫu <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="Nhập tên biểu mẫu" 
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm"
                />
              </div>

              {/* Mã mẫu phiếu */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Mã mẫu phiếu <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="Nhập mã mẫu phiếu" 
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm"
                />
              </div>

              {/* Card for "Phần đầu báo cáo" */}
              <Card
          title="Phần đầu báo cáo"
          extra={<Button type="primary" onClick={handleAddField}>Thêm trường</Button>}
          className="mb-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
        >
          <p className="text-sm text-gray-500">Các trường thông tin</p>
          {selectedFields.map(field => (
            <div key={field} className="mb-4 border border-gray-300 p-2 rounded-md">
              <label className="block font-semibold mb-1">{field}</label>
              <Input 
                placeholder={`Nhập ${field}`} 
                value={inputValues[field] || ''} // Bind input value to state
                onChange={(e) => handleInputChange(field, e.target.value)} // Update state on input change
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          ))}
        </Card>

              {/* Card for "Phần tiêu chí" */}
              <Card 
                title="Phần tiêu chí" 
                extra={<Button type="primary" onClick={() => setIsAddCriteriaFieldModalVisible(true)}>Thêm trường</Button>} 
                className="mb-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <p className="text-sm text-gray-500">Các trường thông tin</p>
                {selectedCriteriaFields.map(field => (
                  <div key={field} className="mb-4 border border-gray-300 p-2 rounded-md">
                    <label className="block font-semibold mb-1">{field}</label>
                    
                  </div>
                ))}
              </Card>

              {/* Card for "Phần chỉ tiêu" */}
              <Card 
  title="Phần chỉ tiêu" 
  extra={<Button type="primary" onClick={() => setIsAddIndicatorFieldModalVisible(true)}>Thêm trường</Button>} 
  className="mb-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
>
  <p className="text-sm text-gray-500">Các trường thông tin</p>
  {selectedIndicatorFields.map(field => (
    <div key={field} className="mb-4 border border-gray-300 p-2 rounded-md">
      <label className="block font-semibold mb-1">{field}</label>
    </div>
  ))}
</Card>

              {/* Card for "Phần báo cuối" */}
              <Card 
          title="Phần báo cuối" 
          extra={<Button type="primary" onClick={() => setIsModalbaocao(true)}>Thêm trường</Button>} 
          className="mb-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
        >
          <p className="text-sm text-gray-500">Các trường thông tin</p>
          {cardFields.map(field => (
            <div key={field} className="mb-4 border border-gray-300 p-2 rounded-md">
              <label className="block font-semibold mb-1">{field}</label>
              <Input placeholder={`Nhập ${field}`} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
          ))}
        </Card>
            </div>
            {/* Right Column */}
            <div className="flex-1 flex flex-col items-center">
  {/* Top Paragraphs */}
  <div className="flex justify-between w-full mb-2"> {/* Use justify-between to space out the items */}
  <p className="mr-2">{inputValues[selectedFields[0]] || ''}</p> {/* This will show the first selected field or default to '1' */}
  <p className="ml-2">{inputValues[selectedFields[1]] || ''}</p>
 {/* This will show the second selected field or default to '2' */}
  </div>

  {/* Centered Paragraph */}
  <p className="mb-2">{inputValues[selectedFields[2]] || ''}</p>

  {/* Mẫu Phiếu Box */}
  <div className="border border-gray-300 rounded-lg p-4 w-full min-h-[300px] bg-gray-50">
    <b className="text-lg" style={{ color: 'black', textAlign: 'center' ,marginLeft: '400px',}}>MẪU PHIẾU</b>
    {/* Có thể thêm preview mẫu phiếu ở đây */}
  </div>

  {/* Bottom Paragraphs */}
  <div className="flex flex-col items-end mt-2 w-full"> {/* Align items to the right */}
    <p className="mb-2">1</p> {/* This will be above */}
    <p>1</p> {/* This will be below */}
  </div>
</div>
          </div>
        </Modal>

        {/* Add Field Modal */}
        <Modal
          title="Thêm trường thông tin"
          visible={isAddFieldModalVisible}
          onCancel={() => setIsAddFieldModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsAddFieldModalVisible(false)}>
              Hủy
            </Button>,
            <Button 
              key="save" 
              type="primary" 
              onClick={() => {
                console.log("Selected Fields:", selectedFields);
                setIsAddFieldModalVisible(false);
              }}
            >
              Lưu
            </Button>,
          ]}
        >
          <div>
            <div className="flex flex-col mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Trường thông tin <span className="text-red-500">*</span>
              </label>
              <Select 
                mode="multiple"
                allowClear
                placeholder="Chọn trường thông tin" 
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm"
                value={selectedFields}
                onChange={handleFieldSelect}
              >
                <Option value="Đơn vị chủ quản" disabled={selectedFields.includes("Đơn vị chủ quản")}>
                  Đơn vị chủ quản
                </Option>
                <Option value="Quốc hiệu tiêu ngữ" disabled={selectedFields.includes("Quốc hiệu tiêu ngữ")}>
                  Quốc hiệu tiêu ngữ
                </Option>
                <Option value="Tiêu đề báo cáo" disabled={selectedFields.includes("Tiêu đề báo cáo")}>
                  Tiêu đề báo cáo
                </Option>
              </Select>
            </div>
          </div>
        </Modal>

        {/* Add Criteria Field Modal */}
        <Modal
  title="Thêm tiêu chí"
  visible={isAddCriteriaFieldModalVisible}
  onCancel={() => setIsAddCriteriaFieldModalVisible(false)}
  footer={[
    <Button key="cancel" onClick={() => setIsAddCriteriaFieldModalVisible(false)}>
      Hủy
    </Button>,
    <Button 
      key="save" 
      type="primary" 
      onClick={() => {
        console.log("Selected Criteria Fields:", selectedCriteriaFields);
        setIsAddCriteriaFieldModalVisible(false);
      }}
    >
      Lưu
    </Button>,
  ]}
>
  <div>
    <div className="flex flex-col mb-4">
      <label className="block text-sm font-medium text-gray-700">
        Tiêu chí <span className="text-red-500">*</span>
      </label>
      <Select
        mode="multiple"
        allowClear
        placeholder="Chọn tiêu chí"
        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm"
        value={selectedCriteriaFields}
        onChange={handleCriteriaFieldSelect}
      >
        <Option value="Tiêu chí 1" disabled={selectedCriteriaFields.includes("Tiêu chí 1")}>
          Tiêu chí 1
        </Option>
        <Option value="Tiêu chí 2" disabled={selectedCriteriaFields.includes("Tiêu chí 2")}>
          Tiêu chí 2
        </Option>
        <Option value="Tiêu chí 3" disabled={selectedCriteriaFields.includes("Tiêu chí 3")}>
          Tiêu chí 3
        </Option>
      </Select>
    </div>
  </div>
</Modal>
<Modal
  title="Thêm chỉ tiêu"
  visible={isAddIndicatorFieldModalVisible}
  onCancel={() => setIsAddIndicatorFieldModalVisible(false)}
  footer={[
    <Button key="cancel" onClick={() => setIsAddIndicatorFieldModalVisible(false)}>
      Hủy
    </Button>,
    <Button 
      key="save" 
      type="primary" 
      onClick={() => {
        console.log("Selected Indicator Fields:", selectedIndicatorFields);
        setIsAddIndicatorFieldModalVisible(false);
      }}
    >
      Lưu
    </Button>,
  ]}
>
  <div>
    <div className="flex flex-col mb-4">
      <label className="block text-sm font-medium text-gray-700">
        Chỉ tiêu <span className="text-red-500">*</span>
      </label>
      <Select
        mode="multiple"
        allowClear
        placeholder="Chọn chỉ tiêu"
        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm"
        value={selectedIndicatorFields}
        onChange={handleIndicatorFieldSelect}
      >
        <Option value="Chỉ tiêu 1" disabled={selectedIndicatorFields.includes("Chỉ tiêu 1")}>
          Chỉ tiêu 1
        </Option>
        <Option value="Chỉ tiêu 2" disabled={selectedIndicatorFields.includes("Chỉ tiêu 2")}>
          Chỉ tiêu 2
        </Option>
        <Option value="Chỉ tiêu 3" disabled={selectedIndicatorFields.includes("Chỉ tiêu 3")}>
          Chỉ tiêu 3
        </Option>
        <Option value="Chỉ tiêu 4" disabled={selectedIndicatorFields.includes("Chỉ tiêu 4")}>
          Chỉ tiêu 4
        </Option>
        <Option value="Chỉ tiêu 5" disabled={selectedIndicatorFields.includes("Chỉ tiêu 5")}>
          Chỉ tiêu 5
        </Option>
      </Select>
    </div>
  </div>
</Modal>
<Modal
          title="Thêm báo cáo cuối"
          visible={isModalbaocao}
          onCancel={() => setIsModalbaocao(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalbaocao(false)}>Hủy</Button>,
            <Button key="save" type="primary" onClick={handleAddReport}>Thêm thông tin</Button>,
          ]}
        >
          <label className="block mb-2 font-semibold">Trường thông tin <span className="text-red-500">*</span></label>
          <Select
            mode="multiple"
            allowClear
            placeholder="Chọn tiêu chí"
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm"
            value={selectedbaocao}
            onChange={handleSelectbaocao}
          >
            <Option value="Lưu nhận" disabled={selectedbaocao.includes("Lưu nhận")}>
              Lưu nhận
            </Option>
            <Option value="Ngày tháng" disabled={selectedbaocao.includes("Ngày tháng")}>
              Ngày tháng
            </Option>
          </Select>
        </Modal>
        <Modal
          title="Xác nhận xóa"
          visible={deleteModalVisible}
          onOk={handleDelete}
          onCancel={() => setDeleteModalVisible(false)}
        >
          <p>Bạn có chắc chắn muốn xóa mẫu phiếu này không?</p>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Nguoidung;