// màn mãu phiếu
import React, { useState, useEffect } from 'react';
import { Button, Layout, Table, Input, Select, message, DatePicker, Modal, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../../../assets/css/Nguoidung.css';
import axiosInstance from '../../../utils/axiosInstance';
const { Option } = Select;
const { Content } = Layout;
const { Search } = Input;
const Nguoidung = () => {
  
   // Initialize as an empty array
   const [mauPhieuList, setTieuChiS] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [tenMauPhieu, setTenMauPhieu] = useState('');
  const [maMauPhieu, setMaMauPhieu] = useState('');
  const [loaiMauPhieuID, setLoaiMauPhieuID] = useState(null);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [chiTieuList, setChiTieuList] = useState([]);
  const [tieuChiList, setTieuChiList] = useState([]);
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
    setInputValues((prev) => ({
        ...prev,
        [field]: value, // Cập nhật giá trị của trường
    }));
};
  // màn tiêu chí
  const handleCriteriaFieldSelect = (selectedValues) => {
    const selectedFields = selectedValues.map(value => 
        tieuChiList.find(item => item.TenTieuChi === value)
    ).filter(Boolean);
    
    setSelectedCriteriaFields(selectedFields.map(item => item.TenTieuChi));
    
    // Update the TieuChiS state to reflect the selected criteria
    const tieuChiS = selectedFields.map(field => field.TenTieuChi);
    setTieuChiS(tieuChiS); // Assuming you have a state for TieuChiS
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
  const handleUpdate = async () => {
    const payload = {
        MauPhieuID: recordToEdit.key, // Assuming recordToEdit contains the ID of the record being edited
        TenMauPhieu: tenMauPhieu,
        MaMauPhieu: maMauPhieu,
        KyBaoCaoID: 1, // Set this as needed
        ThangBaoCao: "string", // Set this as needed
        LoaiMauPhieuID: loaiMauPhieuID,
        ChiTieuS: JSON.stringify(selectedIndicatorFields.map(field => {
            const indicator = chiTieuList.find(item => item.TenChiTieu === field);
            return {
                ChiTieuID: indicator.ChiTieuID,
                MaChiTieu: indicator.MaChiTieu,
                TenChiTieu: indicator.TenChiTieu,
                ChiTieuChaID: indicator.ChiTieuChaID,
                GhiChu: indicator.GhiChu,
                TrangThai: indicator.TrangThai,
                LoaiMauPhieuID: indicator.LoaiMauPhieuID,
                children: indicator.children || []
            };
        })).replace(/\\/g, '\\\\'), // Send selected fields
        TieuChiS: JSON.stringify(selectedCriteriaFields.map(field => {
            const criterion = tieuChiList.find(item => item.TenTieuChi === field);
            return {
                TieuChiID: criterion.TieuChiID,
                MaTieuChi: criterion.MaTieuChi,
                TenTieuChi: criterion.TenTieuChi,
                TieuChiChaID: criterion.TieuChiChaID,
                GhiChu: criterion.GhiChu,
                KieuDuLieuCot: criterion.KieuDuLieuCot,
                TrangThai: criterion.TrangThai,
                LoaiTieuChi: criterion.LoaiTieuChi,
                CapDo: criterion.CapDo,
                children: criterion.children || []
            };
        })).replace(/\\/g, '\\\\'), // Send selected criteria
        ChiTietMauPhieus: selectedChildren.map(child => ({
            ChiTietMauPhieuID: child.ChiTietMauPhieuID || 0, // Use existing ID if editing
            MauPhieuID: recordToEdit.key, // Reference to the main MauPhieuID
            ChitieuID: child.ChiTieuID,
            TieuChiIDs: child.TieuChiIDs || [], // Ensure this is an array of integers
            GopCot: 1,
            GoptuCot: 1,
            GopDenCot: 0,
            SoCotGop: 0,
            NoiDung: "" // Set this as needed
        })),
        NguoiTao: "", // Set this as needed
        model: "" // Ensure to include the correct model name here
    };
    try {
        const response = await axiosInstance.post('/RpMauPhieu/Update', payload);
        if (response.data && response.data.status === 1) {
            message.success('Cập nhật mẫu phiếu thành công!');
            setIsModalVisible(false);
            // Optionally refresh data or update the specific record in the dataSource
        } else {
            message.error(response.data.message || 'Cập nhật mẫu phiếu thất bại!');
        }
    } catch (error) {
        message.error('Lỗi khi cập nhật mẫu phiếu: ' + error.message);
    }
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
          <Button type="link" style={{ color: 'black', fontSize: '20px' }} onClick={() => handleEdit(record)}>
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
         
        </span>
      ),
    },
  ];
  const handleEdit = async (record) => {
    try {
        const response = await axiosInstance.get(`/RpMauPhieu/FindByID?id=${record.key}`);
        if (response.data.status === 1) {
            const data = response.data.data;

            // Cập nhật các trường cơ bản
            setTenMauPhieu(data.TenMauPhieu);
            setMaMauPhieu(data.MaMauPhieu);
            setLoaiMauPhieuID(data.LoaiMauPhieuID);

            // Cập nhật CotIDs cho "Phần đầu báo cáo"
            if (Array.isArray(data.CotIDs)) {
                const fields = data.CotIDs.map((cot) => cot.TenCot); // Lấy danh sách tên cột
                setSelectedFields(fields);

                const values = data.CotIDs.reduce((acc, cot) => {
                    acc[cot.TenCot] = cot.GiaTri || ''; // Lấy giá trị của từng cột
                    return acc;
                }, {});
                setInputValues(values);
            } else {
                setSelectedFields([]); // Nếu không có CotIDs, đặt giá trị mặc định
                setInputValues({});
            }

            // Parse ChiTieuS và TieuChiS
            const parsedIndicatorFields = data.ChiTieuS ? JSON.parse(data.ChiTieuS) : [];
            const parsedCriteriaFields = data.TieuChiS ? JSON.parse(data.TieuChiS) : [];
            setSelectedIndicatorFields(Array.isArray(parsedIndicatorFields) ? parsedIndicatorFields : []);
            setSelectedCriteriaFields(Array.isArray(parsedCriteriaFields) ? parsedCriteriaFields : []);
            setSelectedChildren(data.ChiTietMauPhieus || []);
        } else {
            message.error('Không thể lấy dữ liệu chi tiết mẫu phiếu');
        }
    } catch (error) {
        message.error('Lỗi khi lấy dữ liệu: ' + error.message);
    }

    // Đặt trạng thái chỉnh sửa và hiển thị modal
    setIsEditMode(true); // Chuyển sang chế độ chỉnh sửa
    setRecordToEdit(record); // Lưu thông tin bản ghi đang chỉnh sửa
    setIsModalVisible(true); // Hiển thị modal
};
const fetchLoaiMauPhieu = async () => {
  const response = await axiosInstance.get('/v1/DanhMucLoaiMauPhieu/DanhSachLoaiMauPhieu?pageNumber=1&pageSize=20');
  if (response.data.status === 1) {
      setLoaiMauPhieuList(response.data.data);
  } else {
      message.error('Không thể lấy dữ liệu Loại Mẫu Phiếu');
  }
};

const fetchDataMauPhieu = async () => {
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
};

const fetchTieuChi = async () => {
  const response = await axiosInstance.get('/v1/DanhMucTieuChi/DanhSachTieuChi?pageNumber=1&pageSize=20');
  if (response.data.status === 1) {
      setTieuChiList(response.data.data); // Store all items
  } else {
      message.error('Không thể lấy dữ liệu Tiêu Chí');
  }
};

const fetchChiTieu = async () => {
  const response = await axiosInstance.get('/v1/DanhMucChiTieu/DanhSachChiTieu?pageNumber=1&pageSize=20');
  if (response.data.status === 1) {
      setChiTieuList(response.data.data);
  } else {
      message.error('Không thể lấy dữ liệu Chi Tiêu');
  }
};

const fetchData = async () => {
  try {
      await Promise.all([
          fetchLoaiMauPhieu(),
          fetchDataMauPhieu(),
          fetchTieuChi(),
          fetchChiTieu(),
      ]);
  } catch (err) {
      message.error('Lỗi khi lấy dữ liệu: ' + err.message);
  }
};

useEffect(() => {
  fetchData();
}, []);

  const renderChildren = (children) => {
    return children.map(child => (
      <div key={child.TieuChiID} className="ml-4 mb-2 border border-gray-300 p-2 rounded-md">
        <label className="block font-semibold mb-1">{child.TenTieuChi}</label>
        {/* If the child has its own children, render them recursively */}
        {child.children && child.children.length > 0 && renderChildren(child.children)}
      </div>
    ));
  };
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
  const Luu = async () => {
    const payload = {
        TenMauPhieu: tenMauPhieu,
        MaMauPhieu: maMauPhieu,
        LoaiMauPhieuID: loaiMauPhieuID,
        KyBaoCaoID: 1, // Set this as needed
        ThangBaoCao: "string", // Set this as needed
        ChiTieuS: JSON.stringify(selectedIndicatorFields).replace(/\\/g, '\\\\'), // Send selected fields
        TieuChiS: JSON.stringify(selectedCriteriaFields).replace(/\\/g, '\\\\'), // Send selected criteria
        ChiTietMauPhieus: selectedChildren.map(child => ({
            MauPhieuID: 0, // Set this as needed
            ChitieuID: child.ChiTieuID,
            TieuChiIDs: "string", // Set this as needed
            GopCot: true,
            GoptuCot: 0,
            GopDenCot: 0,
            SoCotGop: 0,
            NoiDung: "string" // Set this as needed
        })),
        NguoiTao: "string" // Set this as needed
    };

    try {
        const response = await axiosInstance.post('/RpMauPhieu/Insert', payload);
        if (response.data.status === 1) {
            message.success('Thêm mẫu phiếu thành công!');
            // Optionally, refresh data or close modal
        } else {
            message.error(response.data.message || 'Thêm mẫu phiếu thất bại!');
        }
    } catch (error) {
        message.error('Lỗi khi thêm mẫu phiếu: ' + error.message);
    }
};
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid #ccc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 className="text-2xl font-bold mb-6 text-center">QUẢN LÝ MẪU PHIẾU</h1>
          <Button
  type="primary"
  onClick={() => {
    // Đặt lại trạng thái khi nhấn "Thêm"
    setIsEditMode(false); // Chuyển sang chế độ thêm mới
    setRecordToEdit(null); // Xóa dữ liệu bản ghi đang chỉnh sửa
    setTenMauPhieu(''); // Đặt lại tên mẫu phiếu
    setMaMauPhieu(''); // Đặt lại mã mẫu phiếu
    setLoaiMauPhieuID(null); // Đặt lại loại mẫu phiếu
    setSelectedChildren([]); // Đặt lại danh sách chỉ tiêu con
    setSelectedIndicatorFields([]); // Đặt lại danh sách chỉ tiêu
    setSelectedCriteriaFields([]); // Đặt lại danh sách tiêu chí
    setInputValues({}); // Đặt lại giá trị các trường nhập liệu
    setIsModalVisible(true); // Hiển thị modal
  }}
>
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
    title={isEditMode ? "Sửa mẫu phiếu" : "Thêm mới mẫu phiếu"}
    visible={isModalVisible}
    width={12000} // Adjust the width to fit the content
    onCancel={() => setIsModalVisible(false)}
    footer={[
        <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Hủy
        </Button>,
        <Button
            key="save"
            type="primary"
            onClick={() => {
                Modal.confirm({
                    title: 'Xác nhận',
                    content: isEditMode
                        ? 'Bạn có chắc chắn muốn cập nhật mẫu phiếu này không?'
                        : 'Bạn có chắc chắn muốn thêm mới mẫu phiếu này không?',
                    onOk: () => {
                        if (isEditMode) {
                            handleUpdate(); // Call handleUpdate if in edit mode
                        } else {
                            Luu(); // Call Luu if in add mode
                        }
                    },
                });
            }}
        >
            Lưu
        </Button>,
    ]}
>
<div className="grid grid-cols-2 gap-4">
    {/* Left Column */}
    <div className="col-span-1" style={{ height: '538px', overflowY: 'auto' }}>
        {/* Loại mẫu phiếu */}
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
                Loại mẫu phiếu <span className="text-red-500">*</span>
            </label>
            <Select
                value={loaiMauPhieuID} 
                placeholder="Chọn loại mẫu phiếu"
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm"
                onChange={value => setLoaiMauPhieuID(value)} // Cập nhật state khi người dùng chọn
            >
                {loaiMauPhieuList.map(item => (
                    <Select.Option key={item.LoaiMauPhieuID} value={item.LoaiMauPhieuID}>
                        {item.TenLoaiMauPhieu}
                    </Select.Option>
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
                value={tenMauPhieu} // Ràng buộc với state
                onChange={e => setTenMauPhieu(e.target.value)} // Cập nhật state khi người dùng nhập
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
                value={maMauPhieu} // Ràng buộc với state
                onChange={e => setMaMauPhieu(e.target.value)} // Cập nhật state khi người dùng nhập
            />
        </div>
        {/* Card for "Phần đầu báo cáo" */}
        <Card
    title="Phần đầu báo cáo"
    extra={<Button type="primary" onClick={handleAddField}>Thêm trường</Button>}
    className="mb-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
>
    <p className="text-sm text-gray-500">Các trường thông tin</p>
    {selectedFields.map((field) => (
        <div key={field} className="mb-4 border border-gray-300 p-2 rounded-md">
            <label className="block font-semibold mb-1">{field}</label>
            <Input.TextArea
                placeholder={`Nhập ${field}`}
                value={inputValues[field] || ''} // Hiển thị giá trị từ inputValues
                onChange={(e) => handleInputChange(field, e.target.value)} // Cập nhật giá trị khi người dùng nhập
                autoSize={{ minRows: 2, maxRows: 5 }}
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
    {selectedCriteriaFields.map(field => {
        const criterion = tieuChiList.find(item => item.TenTieuChi === field);
        return (
            <div key={field} className="mb-4 border border-gray-300 p-2 rounded-md">
                <label className="block font-semibold mb-1">{field}</label>
                {criterion && criterion.children && criterion.children.length > 0 && renderChildren(criterion.children)}
            </div>
        );
    })}
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
                <div className="bg-gray-100 px-3 py-2 font-semibold">
                    {field}
                </div>
                {selectedChildren
                    .filter(child => child.ChiTieuChaID === parentIndicator?.ChiTieuID)
                    .map(child => (
                        <div
                            key={child.ChiTieuID}
                            className="border border-gray-300 p-2 m-2 rounded-md flex justify-between items-center"
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
            <Input.TextArea
                placeholder={`Nhập ${field}`}
                value={inputValues[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                autoSize={{ minRows: 2, maxRows: 6 }} // Điều chỉnh kích thước tự động
            />
        </div>
    ))}
</Card>
    </div>
    {/* Right Column */}
    <div className="col-span-1 flex flex-col items-center">
        {/* Top Paragraphs */}
        <div className="flex justify-between w-full mb-2">
            <p className="mr-2 whitespace-pre-line">
                {inputValues[selectedFields[0]] || ''}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '10px' }}>
  <b
    className="ml-2 whitespace-pre-line"
    style={{
      marginLeft: '10px',
      textAlign: inputValues[selectedFields[1]] ? 'center' : 'left', // Center if value exists
      width: '100%', // Ensure it takes full width for centering
    }}
  >
    {inputValues[selectedFields[1]] || ''}
  </b>
</div>
        </div>
        {/* Centered Paragraph */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '10px' }}>
        <p
  className="mb-2 whitespace-pre-line"
  style={{
    textAlign: inputValues[selectedFields[2]] ? 'center' : 'left', // Căn giữa nếu có giá trị
    width: '100%', // Đảm bảo chiếm toàn bộ chiều rộng để căn giữa
    margin: 0, // Loại bỏ margin mặc định nếu cần
    fontFamily: '"Times New Roman", Times, serif', // Định dạng font Times New Roman
  }}
>
  {inputValues[selectedFields[2]] || ''}
</p>
</div>
        {/* Mẫu Phiếu Box */}
        <div className="border border-gray-300 rounded-lg p-4 w-full min-h-[300px] bg-gray-50">
            <h1 className="text-2xl font-bold mb-4 text-center" style={{ color: '#000' }}>MẪU PHIẾU</h1>
            <div className="flex flex-col mt-4 border border-gray-300 p-2 rounded-lg w-full">
                {/* Hiển thị tiêu chí */}
                <div className="border border-gray-300 p-2 rounded-lg w-full">
                    {/* Display Criteria Fields */}
                    <div className="overflow-auto max-h-60"> {/* Thay đổi max-h-60 theo nhu cầu */}
                        <table className="w-full border-collapse border border-gray-300">
                        <thead>
    <tr className="bg-gray-100">
        {selectedCriteriaFields.map(field => {
            const parentCriterion = tieuChiList.find(item => item.TenTieuChi === field);
            if (parentCriterion && parentCriterion.children && parentCriterion.children.length > 0) {
                return (
                    <th key={parentCriterion.TieuChiID} className="border border-gray-300 px-4 py-2 text-center" colSpan={parentCriterion.children.length}>
                        {parentCriterion.TenTieuChi}
                    </th>
                );
            } else {
                return (
                    <th key={field} className="border border-gray-300 px-4 py-2 text-center">
                        {field}
                    </th>
                );
            }
        })}
        {/* Add fixed columns if needed */}
    </tr>
    <tr className="bg-gray-100">
        {selectedCriteriaFields.map(field => {
            const parentCriterion = tieuChiList.find(item => item.TenTieuChi === field);
            if (parentCriterion && parentCriterion.children && parentCriterion.children.length > 0) {
                return parentCriterion.children.map(child => (
                    <th key={child.TieuChiID} className="border border-gray-300 px-4 py-2 text-center">
                        {child.TenTieuChi}
                    </th>
                ));
            } else {
                return (
                    <th key={field} className="border border-gray-300 px-4 py-2 text-center">
                        {/* Empty cell for non-parent criteria */}
                    </th>
                );
            }
        })}
        {/* Add fixed columns if needed */}
    </tr>
</thead>
<tbody>
    {selectedChildren.map((child, index) => {
        // Find the parent criterion of the child
        const parent = chiTieuList.find(item => item.ChiTieuID === child.ChiTieuChaID);

        return (
            <tr key={child.ChiTieuID} className="border-b border-gray-300">
                <td className="border border-gray-300 px-4 py-2">
                    {/* Empty cell for parent criteria */}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                    {child.TenChiTieu}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                    {/* Empty cell for Ghi chú */}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                    {/* Empty cell for Tháng/năm */}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                    {/* Empty cell for Tháng/năm */}
                </td>
            </tr>
        );
    })}
</tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Bottom Paragraphs */}
            <div className="flex flex-col items-end mt-2 w-full">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '10px' }}>
  <p
    className="mb-2 whitespace-pre-line"
    style={{
      textAlign: inputValues[cardFields[0]] ? 'center' : 'left', // Center if value exists
      width: '100%', // Ensure it takes full width for centering
      margin: 0, // Remove default margin if needed
    }}
  >
    {inputValues[cardFields[0]] || ''}
  </p>
</div>
                <p className="whitespace-pre-line">{inputValues[cardFields[1]] || ''}</p>
            </div>
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
        {tieuChiList.filter(item => item.LoaiTieuChi === 2).map(item => (
            <Option key={item.TieuChiID} value={item.TenTieuChi}>
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
