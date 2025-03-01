import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Button, Tree, Input, Menu, Dropdown, message, Form, Select, Modal, Row, Col, Checkbox } from 'antd';
import axiosInstance from '../../../utils/axiosInstance';
const { Option } = Select;
const { Content } = Layout;
const { Search } = Input;
const Donvi = () => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [xaList, setXaList] = useState([]);
  const [huyenList, setHuyenList] = useState([]);
  const [selectedTinh, setSelectedTinh] = useState(null);
  const [tinhList, setTinhList] = useState([]);
  const [thamQuyen, setThamQuyen] = useState([]);
  const [capList, setCapList] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loaiMauPhieuList, setLoaiMauPhieuList] = useState([]);
  const [form] = Form.useForm();
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const showEditModal = async (item) => {
    setIsEditModalVisible(true);
    form.resetFields();
    if (item) {
      const details = await fetchCoQuanDetails(item.key);
      if (details) {
        // Lấy thông tin cơ quan cha
        const parentDetails = await fetchCoQuanDetails(details.CoQuanChaID);
        form.setFieldsValue({
          TenCoQuanCha: parentDetails ? parentDetails.TenCoQuan : '', // Nếu không có cơ quan cha, để trống
          CoQuanChaID: details.CoQuanChaID,
          MaCoQuan: details.MaCoQuan,
          TenCoQuan: details.TenCoQuan,
          CapID: details.CapID,
          ThamQuyenID: details.ThamQuyenID,
          TinhID: details.TinhID,
          HuyenID: details.HuyenID,
          XaID: details.XaID,
          CQCoHieuLuc: details.CQCoHieuLuc,
          CQCapUBND: details.CQCapUBND,
          CQCapThanhTra: details.CQCapThanhTra,
          CQThuocHeThongPM: details.CQThuocHeThongPM,
          QTCanBoTiepDan: details.QTCanBoTiepDan,
          QTVanThuTiepNhanDon: details.QTVanThuTiepNhanDon,
          QTTiepCongDanVaXuLyDonPhucTap: details.QTTiepCongDanVaXuLyDonPhucTap,
          QTGiaiQuyetPhucTap: details.QTGiaiQuyetPhucTap,
        });
      }
    }
  };
  const handleDelete = async () => {
    if (!selectedItem) {
      message.error('Vui lòng chọn một cơ quan để xóa.');
      return;
    }
  
    try {
      const response = await axiosInstance.post(`/v1/DanhMucCoQuanDonVi/XoaDanhMucCoQuan?id=${selectedItem.key}`);
      
      if (response.data.status === 1) {
        message.success('Xóa cơ quan thành công!');
        await fetchData(); // Gọi lại dữ liệu sau khi xóa thành công
        setSelectedItem(null); // Đặt lại item đã chọn
      } else {
        message.error('Xóa cơ quan thất bại: ' + response.data.message);
      }
    } catch (error) {
      console.error('Lỗi khi xóa cơ quan:', error);
      message.error('Lỗi khi xóa cơ quan');
    }
  };
  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Tạo đối tượng dữ liệu để gửi đến API
      const dataToUpdate = {
        CoQuanID: selectedItem.key, // ID của cơ quan cần cập nhật
        ...values, // Các giá trị từ form
      };
  
      // Gọi API cập nhật
      const response = await axiosInstance.post('/v1/DanhMucCoQuanDonVi/CapNhatDuLieuCoQuan', dataToUpdate);
  
      if (response.data.status === 1) {
        message.success('Cập nhật cơ quan thành công!');
        await fetchData(); // Gọi lại dữ liệu sau khi cập nhật thành công
        setIsEditModalVisible(false);
        form.resetFields();
      } else {
        message.error('Cập nhật cơ quan thất bại: ' + response.data.message);
      }
    } catch (error) {
      console.error('Lỗi form:', error);
      message.error('Vui lòng kiểm tra lại các trường nhập');
    }
  };
  const fetchData = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/v1/DanhMucCoQuanDonVi/DanhSachCoQuan');
      if (response.data.status === 1) {
        setData(transformDataToTree(response.data.data));
      } else {
        message.error('Không thể lấy dữ liệu cơ quan');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Lỗi khi lấy dữ liệu');
    }
  }, []);

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
  const fetchCapList = async () => {
    try {
      const response = await axiosInstance.get('/v1/DanhMucCoQuanDonVi/DanhSachCap');
      if (response.data.status === 1) {
        setCapList(response.data.data);
      } else {
        message.error('Không thể lấy dữ liệu cấp');
      }
    } catch (error) {
      console.error('Error fetching cap list:', error);
      message.error('Lỗi khi lấy dữ liệu cấp');
    }
  };
  const handleHuyenChange = async (value) => {
    try {
        const response = await axiosInstance.get(
            `/v1/DanhMucCoQuanDonVi/DanhSachXaTheoHuyenID?id=${value}`
        );
        if (response.data.status === 1) {
            setXaList(response.data.data);
        } else {
            message.error('Không lấy được danh sách xã');
        }
    } catch (err) {
        message.error('Lỗi khi lấy danh sách xã: ' + err.message);
    }
};
  const fetchThamQuyen = async () => {
    try {
      const response = await axiosInstance.get('/v1/DanhMucCoQuanDonVi/DanhSachThamQuyen');
      if (response.data.status === 1) {
        setThamQuyen(response.data.data); // Assuming you have a state variable for thamQuyen
      } else {
        message.error('Không thể lấy dữ liệu thẩm quyền');
      }
    } catch (error) {
      console.error('Error fetching tham quyen:', error);
      message.error('Lỗi khi lấy dữ liệu thẩm quyền');
    }
  };
  const fetchTinh = async () => {
    try {
      const response = await axiosInstance.get('/v1/DanhMucCoQuanDonVi/DanhSachTinh');
      if (response.data.status === 1) {
        setTinhList(response.data.data);
      } else {
        message.error('Failed to fetch Tinh data');
      }
    } catch (err) {
      message.error('Failed to fetch Tinh data: ' + err.message);
    }
  };
  
  const fetchCoQuanDetails = async (id) => {
    try {
      const response = await axiosInstance.get(`/v1/DanhMucCoQuanDonVi/TimCoQuanTheoID?id=${id}`);
      if (response.data.status === 1) {
        return response.data.data;
      } else {
        message.error('Không thể lấy dữ liệu cơ quan');
        return null;
      }
    } catch (error) {
      console.error('Error fetching co quan details:', error);
      message.error('Lỗi khi lấy dữ liệu cơ quan');
      return null;
    }
  };

  useEffect(() => {
    fetchData();
    fetchLoaiMauPhieu();
    fetchCapList(); 
    fetchThamQuyen();
    fetchTinh();
  }, [fetchData]);

  const transformDataToTree = (data) => {
    return data.map((item) => ({
      title: item.TenCoQuan,
      key: item.CoQuanID.toString(),
      children: item.children ? transformDataToTree(item.children) : [],
    }));
  };

  const showAddModal = async (item) => {
    setIsAddModalVisible(true);
    form.resetFields();
    if (item) {
      const details = await fetchCoQuanDetails(item.key);
      if (details) {
        form.setFieldsValue({
          TenCoQuanCha: details.TenCoQuan,
          CoQuanChaID: details.CoQuanID,
        });
      }
    }
  };

  const handleMenuClick = (type) => {
    if (type === 'add') {
      showAddModal(selectedItem);
    } else if (type === 'edit' && selectedItem) {
      showEditModal(selectedItem);
    } else if (type === 'delete' && selectedItem) {
      handleDelete(selectedItem.key);
      // Handle delete logic here
    }
  };

  const handleAddOk = async () => {
    try {
      const values = await form.validateFields();
      const response = await axiosInstance.post('/v1/DanhMucCoQuanDonVi/ThemMoiCoQuan', values);
      if (response.data.status === 1) {
        message.success('Thêm cơ quan thành công!');
        fetchData();
        setIsAddModalVisible(false);
        form.resetFields();
      } else {
        message.error('Thêm cơ quan thất bại: ' + response.data.message);
      }
    } catch (error) {
      console.error('Lỗi form:', error);
      message.error('Vui lòng kiểm tra lại các trường nhập');
    }
  };

  const menu = (
    <Menu onClick={({ key }) => handleMenuClick(key)}>
      <Menu.Item key="add">Thêm đơn vị</Menu.Item>
      <Menu.Item key="edit" disabled={!selectedItem}>Sửa</Menu.Item>
      <Menu.Item key="delete" disabled={!selectedItem}>Xóa</Menu.Item>
    </Menu>
  );

  const onContextMenu = (event, item) => {
    event.preventDefault();
    setSelectedItem(item);
  };

  const loop = (data) =>
    data.map((item) => ({
      title: (
        <Dropdown overlay={menu} trigger={['contextMenu']} key={item.key}>
          <span 
            onContextMenu={(e) => onContextMenu(e, item)} 
            onClick={() => {
              setSelectedItem(item);
              showAddModal(item);
            }}
          >
            {item.title}
          </span>
        </Dropdown>
      ),
      key: item.key,
      children: item.children ? loop(item.children) : [],
    }));
    
  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const handleTinhChange = async (value) => {
    setSelectedTinh(value);
    try {
      const response = await axiosInstance.get(
        `/v1/DanhMucCoQuanDonVi/DanhSachHuyenTheoTinhID?tinhId=${value}`
      );
      if (response.data.status === 1) {
        setHuyenList(response.data.data.length > 0 ? response.data.data : []);
      } else {
        setHuyenList([]);
      }
    } catch (err) {
      setHuyenList([]);
      console.error('Error fetching districts:', err.message);
    }
};

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '0 50px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ fontSize: 19, marginLeft: '10px' }}>DANH MỤC CƠ QUAN, ĐƠN VỊ</h1>
          <Button type="primary" onClick={() => showAddModal(null)}>Thêm cơ quan</Button>
        </div>
        <Search placeholder="Tìm kiếm" style={{ width: 200 }} />
        <Select style={{ width: 200 }} options={loaiMauPhieuList.map((item) => ({ value: item.LoaiMauPhieuID, label: item.TenLoaiMauPhieu }))} />
        <div style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'auto' }}>
          <Tree
            showLine
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onExpand={onExpand}
            treeData={loop(data)}
          />
        </div>
        {/* Modal for adding a new unit */}
        <Modal
  title="Thêm cơ quan đơn vị"
  visible={isAddModalVisible}
  onCancel={() => setIsAddModalVisible(false)}
  width={800}
  footer={[
    <Button key="cancel" onClick={() => setIsAddModalVisible(false)}>Hủy</Button>,
    <Button key="submit" type="primary" onClick={handleAddOk}>Lưu</Button>,
  ]}
>
  <Form form={form} layout="vertical">
    <Form.Item label="Cơ quan cha" name="TenCoQuanCha" rules={[{ required: true }]}>
      <Input disabled />
    </Form.Item>
    <Form.Item name="CoQuanChaID" label="ID Chỉ tiêu cha" hidden>
      <Input />
    </Form.Item>
    
    {/* Row for Mã cơ quan and Tên cơ quan */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Mã cơ quan" name="MaCoQuan" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Tên cơ quan" name="TenCoQuan" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
    </Row>

    {/* Row for Cấp and Thẩm quyền */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Cấp" name="CapID" rules={[{ required: true }]}>
        <Select placeholder="Chọn cấp" allowClear>
                    {capList.map((cap) => (
                      <Select.Option key={cap.CapID} value={cap.CapID}>
                        {cap.TenCap}
                      </Select.Option>
                    ))}
                  </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Thẩm quyền" name="ThamQuyenID" rules={[{ required: true }]}>
        <Select placeholder="Chọn thẩm quyền" allowClear>
    {thamQuyen.map((thamQuyenItem) => (
      <Select.Option key={thamQuyenItem.ThamQuyenID} value={thamQuyenItem.ThamQuyenID}>
        {thamQuyenItem.TenThamQuyen}
      </Select.Option>
    ))}
  </Select>
        </Form.Item>
      </Col>
    </Row>

    {/* Row for Tỉnh, Huyện, and Xã */}
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item label="Tỉnh" name="TinhID" rules={[{ required: true }]}>
        <Select
                    allowClear
                    style={{ width: 200 }}
                    placeholder="Chọn tỉnh"
                    onChange={handleTinhChange}
                  >
                    {tinhList.map((tinh) => (
                      <Option key={tinh.TinhID} value={tinh.TinhID}>
                        {tinh.TenTinh}
                      </Option>
                    ))}
                  </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Huyện" name="HuyenID" rules={[{ required: true }]}>
        <Select 
                    allowClear
                    style={{ width: 200 }} 
                    placeholder="Chọn huyện" 
                    onChange={handleHuyenChange}
                  >
                    {huyenList.length > 0 ? (
                      huyenList.map((huyen) => (
                        <Option key={huyen.HuyenID} value={huyen.HuyenID}>
                          {huyen.TenHuyen}
                        </Option>
                      ))
                    ) : (
                      <Option value={null} disabled>
                        Không có huyện nào
                      </Option>
                    )}
                  </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Xã" name="XaID" rules={[{ required: true }]}>
        <Select 
                    allowClear
                    placeholder="Chọn xã">
                    {xaList.map((xa) => (
                      <Option key={xa.XaID} value={xa.XaID}>
                        {xa.TenXa}
                      </Option>
                    ))}
                  </Select>
        </Form.Item>
      </Col>
    </Row>

    <Form.Item>
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="CQCoHieuLuc" valuePropName="checked">
            <Checkbox>Cơ quan có hiệu lực</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="CQCapUBND" valuePropName="checked">
            <Checkbox>Cơ quan cấp UBND</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="CQCapThanhTra" valuePropName="checked">
            <Checkbox>Cơ quan cấp thanh tra</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="CQThuocHeThongPM" valuePropName="checked">
            <Checkbox>Cơ quan thuộc hệ thống phần mềm</Checkbox>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="QTCanBoTiepDan" valuePropName="checked">
            <Checkbox>Quy trình cán bộ tiếp dân</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="QTVanThuTiepNhanDon" valuePropName="checked">
            <Checkbox>Quy trình văn thư tiếp nhận đơn</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="QTTiepCongDanVaXuLyDonPhucTap" valuePropName="checked">
            <Checkbox>Sử dụng quy trình tiếp công dân, xử lý đơn phức tạp</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="QTGiaiQuyetPhucTap" valuePropName="checked">
            <Checkbox>Sử dụng quy trình giải quyết phức tạp</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </Form.Item>
  </Form>
</Modal>
<Modal
  title="Sửa cơ quan đơn vị"
  visible={isEditModalVisible}
  onCancel={() => setIsEditModalVisible(false)}
  width={800}
  footer={[
    <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>Hủy</Button>,
    <Button key="submit" type="primary" onClick={handleEditOk}>Lưu</Button>,
  ]}
>
  <Form form={form} layout="vertical">
    {/* Similar form fields as in the add modal */}
    <Form.Item label="Cơ quan cha" name="TenCoQuanCha" rules={[{ required: true }]}>
      <Input disabled />
    </Form.Item>
    <Form.Item name="CoQuanChaID" label="ID Chỉ tiêu cha" hidden>
      <Input />
    </Form.Item>
    
    {/* Row for Mã cơ quan and Tên cơ quan */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Mã cơ quan" name="MaCoQuan" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Tên cơ quan" name="TenCoQuan" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
    </Row>

    {/* Row for Cấp and Thẩm quyền */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Cấp" name="CapID" rules={[{ required: true }]}>
          <Select placeholder="Chọn cấp" allowClear>
            {capList.map((cap) => (
              <Select.Option key={cap.CapID} value={cap.CapID}>
                {cap.TenCap}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Thẩm quyền" name="ThamQuyenID" rules={[{ required: true }]}>
          <Select placeholder="Chọn thẩm quyền" allowClear>
            {thamQuyen.map((thamQuyenItem) => (
              <Select.Option key={thamQuyenItem.ThamQuyenID} value={thamQuyenItem.ThamQuyenID}>
                {thamQuyenItem.TenThamQuyen}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>

    {/* Row for Tỉnh, Huyện, and Xã */}
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item label="Tỉnh" name="TinhID" rules={[{ required: true }]}>
          <Select
            allowClear
            style={{ width: 200 }}
            placeholder="Chọn tỉnh"
            onChange={handleTinhChange}
          >
            {tinhList.map((tinh) => (
              <Option key={tinh.TinhID} value={tinh.TinhID}>
                {tinh.TenTinh}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Huyện" name="HuyenID" rules={[{ required: true }]}>
          <Select 
            allowClear
            style={{ width: 200 }} 
            placeholder="Chọn huyện" 
            onChange={handleHuyenChange}
          >
            {huyenList.length > 0 ? (
              huyenList.map((huyen) => (
                <Option key={huyen.HuyenID} value={huyen.HuyenID}>
                  {huyen.TenHuyen}
                </Option>
              ))
            ) : (
              <Option value={null} disabled>
                Không có huyện nào
              </Option>
            )}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Xã" name="XaID" rules={[{ required: true }]}>
          <Select 
            allowClear
            placeholder="Chọn xã">
            {xaList.map((xa) => (
              <Option key={xa.XaID} value={xa.XaID}>
                {xa.TenXa}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>

    {/* Additional checkboxes */}
    <Form.Item>
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="CQCoHieuLuc" valuePropName="checked">
            <Checkbox>Cơ quan có hiệu lực</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="CQCapUBND" valuePropName="checked">
            <Checkbox>Cơ quan cấp UBND</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="CQCapThanhTra" valuePropName="checked">
            <Checkbox>Cơ quan cấp thanh tra</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="CQThuocHeThongPM" valuePropName="checked">
            <Checkbox>Cơ quan thuộc hệ thống phần mềm</Checkbox>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="QTCanBoTiepDan" valuePropName="checked">
            <Checkbox>Quy trình cán bộ tiếp dân</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="QTVanThuTiepNhanDon" valuePropName="checked">
            <Checkbox>Quy trình văn thư tiếp nhận đơn</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="QTTiepCongDanVaXuLyDonPhucTap" valuePropName="checked">
            <Checkbox>Sử dụng quy trình tiếp công dân, xử lý đơn phức tạp</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="QTGiaiQuyetPhucTap" valuePropName="checked">
            <Checkbox>Sử dụng quy trình giải quyết phức tạp</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </Form.Item>
  </Form>
</Modal>
      </Content>
    </Layout>
  );
};

export default Donvi;