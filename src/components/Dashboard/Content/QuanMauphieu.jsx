// màn mãu phiếu
import React, { useState, useEffect } from 'react';
import { Button, Layout, Table, Input, Select, message, DatePicker, Modal, Card } from 'antd';
import { EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import '../../../assets/css/Nguoidung.css';
import axiosInstance from '../../../utils/axiosInstance';
const { Option } = Select;
const { Content } = Layout;
const { Search } = Input;

const Nguoidung = () => {
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [chiTieuList, setChiTieuList] = useState([]);
  const [tieuChiList, setTieuChiList] = useState([]);
  const [criteriaInputValues, setCriteriaInputValues] = useState({});
  const [isModalbaocao, setIsModalbaocao] = useState(false);
  const [selectedbaocao, setSelectedbaocao] = useState([]);
  const [cardFields, setCardFields] = useState([]);
  const [isAddIndicatorFieldModalVisible, setIsAddIndicatorFieldModalVisible] = useState(false);
  const [criteriaFieldValues, setCriteriaFieldValues] = useState({});
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedCriteriaFields, setSelectedCriteriaFields] = useState([]);
  const [isAddFieldModalVisible, setIsAddFieldModalVisible] = useState(false);
  const [isAddCriteriaFieldModalVisible, setIsAddCriteriaFieldModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [loaiMauPhieuList, setLoaiMauPhieuList] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchLoaiMauPhieu, setSearchLoaiMauPhieu] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [selectedIndicatorFields, setSelectedIndicatorFields] = useState([]);
  const [inputValues, setInputValues] = useState({});

  // màn báo cáo
  const handleFieldSelect = (value) => {
    setSelectedFields(value);
    const newInputValues = {};
    value.forEach(field => {
      if (!inputValues[field]) {
        newInputValues[field] = '';
      }
    });
    setInputValues(prev => ({ ...prev, ...newInputValues }));
  };

  const handleInputChange = (field, value) => {
    setInputValues(prev => ({ ...prev, [field]: value }));
  };

  // màn tiêu chí
  const handleCriteriaFieldSelect = (value) => {
    setSelectedCriteriaFields(value);
    const newInputValues = {};
    value.forEach(field => {
      if (!criteriaInputValues[field]) {
        newInputValues[field] = '';
      }
    });
    setCriteriaInputValues(prev => ({ ...prev, ...newInputValues }));
  };
  const getAllChildren = (parent) => {
    let children = [];
    if (parent.children && parent.children.length > 0) {
        parent.children.forEach(child => {
            children.push(child);
            children = [...children, ...getAllChildren(child)]; // Đệ quy lấy con của con
        });
    }
    return children;
};
  // màn chỉ tiêu 
  const handleIndicatorFieldSelect = (value) => {
    setSelectedIndicatorFields(value);
    const newIndicatorFieldValues = { ...criteriaFieldValues };

    value.forEach(field => {
        if (!newIndicatorFieldValues[field]) {
            newIndicatorFieldValues[field] = '';
        }
    });

    setCriteriaFieldValues(newIndicatorFieldValues);

    // Lấy danh sách tất cả chỉ tiêu con từ danh sách cha được chọn
    let allChildren = [];
    value.forEach(field => {
        const parent = chiTieuList.find(item => item.TenChiTieu === field);
        if (parent) {
            allChildren = [...allChildren, ...getAllChildren(parent)];
        }
    });

    setSelectedChildren(allChildren);
};

  const handleSaveIndicatorFields = () => {
    console.log("Selected Indicator Fields:", selectedIndicatorFields);
    setIsAddIndicatorFieldModalVisible(false);
  };

  const handleAddField = () => {
    setIsAddFieldModalVisible(true);
  };

  // màn báo cáo cuối
  const handleAddReport = () => {
    setCardFields(selectedbaocao);
    setIsModalbaocao(false);
  };

  const handleSelectbaocao = (value) => {
    setSelectedbaocao(value);
    const newInputValues = {};
    value.forEach(field => {
      if (!inputValues[field]) {
        newInputValues[field] = '';
      }
    });
    setInputValues(prev => ({ ...prev, ...newInputValues }));
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
              setRecordToDelete(record.key);
              setDeleteModalVisible(true);
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
        const [loaiMauPhieuResponse, dataResponse, tieuChiResponse, chiTieuResponse] = await Promise.all([
          axiosInstance.get('/v1/DanhMucLoaiMauPhieu/DanhSachLoaiMauPhieu?pageNumber=1&pageSize=20'),
          axiosInstance.get('/RpMauPhieu/List?pageNumber=1&pageSize=20'),
          axiosInstance.get('/v1/DanhMucTieuChi/DanhSachTieuChi?pageNumber=1&pageSize=20'),
          axiosInstance.get('/v1/DanhMucChiTieu/DanhSachChiTieu?pageNumber=1&pageSize=20'),
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

        if (tieuChiResponse.data.status === 1) {
          setTieuChiList(tieuChiResponse.data.data);
        } else {
          message.error('Không thể lấy dữ liệu Tiêu Chí');
        }

        if (chiTieuResponse.data.status === 1) {
          setChiTieuList(chiTieuResponse.data.data);
        } else {
          message.error('Không thể lấy dữ liệu Chi Tiêu');
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
      setDeleteModalVisible(false);
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
                      value={inputValues[field] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
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
    {selectedIndicatorFields.map(field => {
        const parentIndicator = chiTieuList.find(item => item.TenChiTieu === field);
        return (
            <div key={field} className="mb-4 border border-gray-300 rounded-md overflow-hidden">
                {/* Chỉ tiêu cha */}
                <div className="bg-gray-100 px-3 py-2 font-semibold">
                    {field}
                </div>

                {/* Hiển thị chỉ tiêu con với viền đỏ */}
                {selectedChildren
                    .filter(child => child.ChiTieuChaID === parentIndicator?.ChiTieuID)
                    .map(child => (
                        <div
                            key={child.ChiTieuID}
                            className="border border-red-500 p-2 m-2 rounded-md flex justify-between items-center"
                        >
                            <span>{child.TenChiTieu}</span>
                        </div>
                    ))}
            </div>
        );
    })}
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
                    <Input
                      placeholder={`Nhập ${field}`}
                      value={inputValues[field] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                ))}
              </Card>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col items-center">
              {/* Top Paragraphs */}
              <div className="flex justify-between w-full mb-2">
                <p className="mr-2">{inputValues[selectedFields[0]] || ''}</p>
                <p className="ml-2">{inputValues[selectedFields[1]] || ''}</p>
              </div>
              {/* Centered Paragraph */}
              <p className="mb-2">{inputValues[selectedFields[2]] || ''}</p>
              {/* Mẫu Phiếu Box */}
              <div className="border border-gray-300 rounded-lg p-4 w-full min-h-[300px] bg-gray-50">
                <b className="text-lg" style={{ color: 'black', textAlign: 'center', marginLeft: '400px' }}>MẪU PHIẾU</b>
                <div className="flex justify-between mt-4 border border-gray-300 p-2 rounded-lg w-full">
                  {selectedCriteriaFields.map((field, index) => (
                    <div key={index} className="flex-1 text-center">
                      <span className="font-semibold">{field}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-start mt-4 border border-gray-300 p-2 rounded-lg w-full">
  {selectedChildren.map(child => {
    // Tìm chỉ tiêu cha dựa trên ChiTieuChaID
    const parent = chiTieuList.find(item => item.ChiTieuID === child.ChiTieuChaID);
    const parentName = parent ? parent.TenChiTieu : '';
    return (
      <div key={child.ChiTieuID} className="mb-2">
        <span className="font-semibold">{parentName} ; {child.TenChiTieu}: </span>
        <span>{criteriaFieldValues[child.TenChiTieu] || ""}</span>
      </div>
    );
  })}
</div>
              </div>
              {/* Bottom Paragraphs */}
              <div className="flex flex-col items-end mt-2 w-full">
                <p className="mb-2">{inputValues[cardFields[0]] || ''}</p>
                <p>{inputValues[cardFields[1]] || ''}</p>
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
                {tieuChiList.map(item => (
                  <Option key={item.TieuChiID} value={item.TenTieuChi} disabled={selectedCriteriaFields.includes(item.TenTieuChi)}>
                    {item.TenTieuChi}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </Modal>

        {/* Add Indicator Field Modal */}
        <Modal
          title="Thêm chỉ tiêu"
          visible={isAddIndicatorFieldModalVisible}
          onCancel={() => setIsAddIndicatorFieldModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsAddIndicatorFieldModalVisible(false)}>Hủy</Button>,
            <Button key="save" type="primary" onClick={handleSaveIndicatorFields}>Lưu</Button>,
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
                {chiTieuList.map(item => (
                  <Option key={item.ChiTieuID} value={item.TenChiTieu} disabled={selectedIndicatorFields.includes(item.TenChiTieu)}>
                    {item.TenChiTieu}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </Modal>

        {/* Add Report Modal */}
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

        {/* Delete Confirmation Modal */}
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