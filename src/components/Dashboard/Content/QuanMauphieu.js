import React, { useState, useEffect } from 'react';
import { Button, Layout, Table, Input, Select, message, DatePicker, Modal, Form, Card } from 'antd';
import { EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import '../../../assets/css/Nguoidung.css';
import axiosInstance from '../../../utils/axiosInstance';
const { Content } = Layout;
const { Search } = Input;

const Nguoidung = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loaiMauPhieuList, setLoaiMauPhieuList] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchLoaiMauPhieu, setSearchLoaiMauPhieu] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddFieldModalVisible, setIsAddFieldModalVisible] = useState(false);
  const [isLastReportModalVisible, setIsLastReportModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [addFieldForm] = Form.useForm();
  const [addFieldValues, setAddFieldValues] = useState([]);
  const [fieldsAdded, setFieldsAdded] = useState(false);
  
  // Thêm state cho các phần chỉ tiêu và cuối báo cáo
  const [criteriaFields, setCriteriaFields] = useState([]);
  const [finalReportFields, setFinalReportFields] = useState([]);
  const [finalReportFieldsAdded, setFinalReportFieldsAdded] = useState(false); // State để theo dõi trường đã thêm cho phần cuối báo cáo

  // State để lưu trữ giá trị nhập vào từ phần đầu báo cáo
  const [inputValues, setInputValues] = useState({});

  const handleAddField = async (values) => {
    try {
      const newFields = values.fieldName.map(field => ({
        title: field,
        value: "",
      }));
      setAddFieldValues((prevValues) => [...prevValues, ...newFields]);
      setFieldsAdded(true);
      message.success('Thêm trường thông tin thành công!');
      setIsAddFieldModalVisible(false);
      addFieldForm.resetFields();
    } catch (error) {
      message.error('Lỗi khi thêm trường thông tin: ' + error.message);
    }
  };

  const handleInputChange = (index, value) => {
    setInputValues((prev) => ({
      ...prev,
      [`field-${index}`]: value,
    }));
  };

  const handleAddFinalReportField = async (values) => {
    try {
      const newFields = values.fieldName.map(field => ({
        title: field,
        value: "",
      }));
      setFinalReportFields((prevValues) => [...prevValues, ...newFields]);
      setFinalReportFieldsAdded(true); // Đánh dấu rằng đã có trường được thêm cho phần cuối báo cáo
      message.success('Thêm trường cuối báo cáo thành công!');
      setIsLastReportModalVisible(false);
    } catch (error) {
      message.error('Lỗi khi thêm trường cuối báo cáo: ' + error.message);
    }
  };

  useEffect(() => {
    const fetchLoaiMauPhieu = async () => {
      try {
        const response = await axiosInstance.get('/DanhMucLoaiMauPhieu/List?pageNumber=1&pageSize=20');
        if (response.data.status === 1) {
          setLoaiMauPhieuList(response.data.data);
        } else {
          message.error('Không thể lấy dữ liệu Loại Mẫu Phiếu');
        }
      } catch (err) {
        message.error('Lỗi khi lấy dữ liệu: ' + err.message);
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

    fetchLoaiMauPhieu();
    fetchData();
  }, []);

  const handleAdd = async (values) => {
    try {
      const response = await axiosInstance.post('/RpMauPhieu/Insert', {
        ChiTieuS: values.ChiTieuS,
        ThangBaoCao: values.ThangBaoCao,
        TenMauPhieu: values.TenMauPhieu,
        LoaiMauPhieuID: values.LoaiMauPhieuID,
        MaMauPhieu: values.MaMauPhieu,
      });
      if (response.data.status === 1) {
        message.success('Thêm mới thành công!');
        setDataSource((prevData) => [...prevData, response.data.data]);
        setIsModalVisible(false);
        form.resetFields();
      } else {
        message.error(response.data.message || 'Thêm mới thất bại');
      }
    } catch (error) {
      message.error('Lỗi khi thêm mới: ' + error.response?.data?.message || error.message);
    }
  };

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

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
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
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
        <Modal
          title="Thêm mẫu phiếu"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Hủy
            </Button>,
            <Button key="submit" type="primary" onClick={() => form.submit()}>
              Lưu
            </Button>,
          ]}
          width={1552}
          bodyStyle={{
            maxHeight: "600px",
            overflowY: "auto",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
            <div
              style={{
                backgroundColor: "#f0f2f5",
                padding: "16px",
                width: "48%",
                borderRadius: "8px",
                border: "2px solid #d9d9d9",
              }}
            >
              <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                form={form}
                onFinish={handleAdd}
              >
                <Form.Item
                  name="LoaiMauPhieuID"
                  label="Loại mẫu phiếu"
                  rules={[{ required: true, message: "Vui lòng chọn loại mẫu phiếu" }]}
                >
                  <Select
                    allowClear
                    placeholder="Loại mẫu phiếu"
                    options={loaiMauPhieuList.map(item => ({
                      value: item.LoaiMauPhieuID,
                      label: item.TenLoaiMauPhieu,
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  name="TenMauPhieu"
                  label="Tên mẫu phiếu"
                  rules={[{ required: true, message: "Vui lòng nhập tên mẫu phiếu" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="MaMauPhieu"
                  label="Mã mẫu phiếu"
                  rules={[{ required: true, message: "Vui lòng nhập mã mẫu phiếu" }]}
                >
                  <Input />
                </Form.Item>
              </Form>
              <div style={{ marginTop: 24 }}>
                {/* Phần đầu báo cáo */}
                <div style={{ marginBottom: "24px" }}>
                  <Card
                    title={<span style={{ fontWeight: "bold" }}>Phần đầu báo cáo</span>}
                    extra={
                      <Button type="primary" size="small" onClick={() => setIsAddFieldModalVisible(true)}>
                        Thêm trường
                      </Button>
                    }
                    style={{
                      border: "1px solid #d9d9d9",
                      borderRadius: "8px",
                      background: "#fafafa",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <p style={{ marginBottom: 0 }}>Các trường thông tin</p>
                    {fieldsAdded && addFieldValues.map((field, index) => (
                      <Form.Item
                        key={index}
                        label={field.title}
                        name={`field-${index}`}
                      >
                        <Input
                          onChange={(e) => handleInputChange(index, e.target.value)} // Cập nhật giá trị nhập
                        />
                      </Form.Item>
                    ))}
                  </Card>
                </div>
                {/* Phần chỉ tiêu */}
                <div style={{ marginBottom: "24px" }}>
                  <Card
                    title={<span style={{ fontWeight: "bold" }}>Phần chỉ tiêu</span>}
                    extra={
                      <Button type="primary" size="small" onClick={() => setIsLastReportModalVisible(true)}>
                        Thêm trường
                      </Button>
                    }
                    style={{
                      border: "1px solid #d9d9d9",
                      borderRadius: "8px",
                      background: "#fafafa",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <p style={{ marginBottom: 0 }}>Các trường thông tin</p>
                    {criteriaFields.map((field, index) => (
                      <Form.Item
                        key={index}
                        label={field.title}
                        name={`criteria-field-${index}`}
                      >
                        <Input
                          onChange={(e) => {
                            const newValues = [...criteriaFields];
                            newValues[index].value = e.target.value;
                            setCriteriaFields(newValues);
                          }}
                        />
                      </Form.Item>
                    ))}
                  </Card>
                </div>
                {/* Phần cuối báo cáo */}
                <div style={{ marginBottom: "24px" }}>
                  <Card
                    title={<span style={{ fontWeight: "bold" }}>Phần cuối báo cáo</span>}
                    extra={
                      <Button type="primary" size="small" onClick={() => setIsLastReportModalVisible(true)}>
                        Thêm trường
                      </Button>
                    }
                    style={{
                      border: "1px solid #d9d9d9",
                      borderRadius: "8px",
                      background: "#fafafa",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <p style={{ marginBottom: 0 }}>Các trường thông tin</p>
                    {finalReportFields.map((field, index) => (
                      <Form.Item
                        key={index}
                        label={field.title}
                        name={`final-report-field-${index}`}
                      >
                        <Input
                          onChange={(e) => {
                            const newValues = [...finalReportFields];
                            newValues[index].value = e.target.value;
                            setFinalReportFields(newValues);
                          }}
                        />
                      </Form.Item>
                    ))}
                  </Card>
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#e6f7ff",
                padding: "16px",
                width: "48%",
                borderRadius: "8px",
                border: "2px solid #d9d9d9",
              }}
            >
              <div>{inputValues['field-0'] || ''}</div>
              <div style={{ marginLeft: "590px", marginTop: "-10px" }}><b>{inputValues['field-1'] || ''}</b></div>
              <div style={{ marginLeft: "300px" }}>{inputValues['field-2'] || ''}</div>
              <div style={{
                backgroundColor: "#e6f7ff",
                padding: "16px",
                width: "95%",
                borderRadius: "8px",
                border: "2px solid #d9d9d9",
                marginTop: "160px",
              }}>
                <h5 style={{ marginLeft: "270px", fontSize: "20px " }}>MẪU PHIẾU</h5>
              </div>
              {/* Hiển thị dữ liệu từ phần cuối báo cáo */}
              <div style={{ marginLeft: "590px" }}>
                {finalReportFields.map((field, index) => (
                  <div key={index}>{field.value}</div>
                ))}
              </div>
            </div>
          </div>
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
                    setIsAddFieldModalVisible(false);
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
                disabled={fieldsAdded} // Vô hiệu hóa nếu đã thêm trường
              >
                <Select.Option value="Đơn vị chủ quản">Đơn vị chủ quản</Select.Option>
                <Select.Option value="Quốc hiệu tiêu ngữ">Quốc hiệu tiêu ngữ</Select.Option>
                <Select.Option value="Tiêu đề báo cáo">Tiêu đề báo cáo</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* Phần cuối báo cáo */}
        <Modal
          title="Thêm trường thông tin"
          visible={isLastReportModalVisible}
          onCancel={() => setIsLastReportModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsLastReportModalVisible(false)}>
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                addFieldForm
                  .validateFields()
                  .then((values) => {
                    handleAddFinalReportField(values);
                    setIsLastReportModalVisible(false);
                  })
                  .catch((info) => console.log("Validation Failed:", info));
              }}
            >
              Lưu
            </Button>
          ]}
        >
          <Form
            form={addFieldForm}
            onFinish={handleAddFinalReportField}
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
                disabled={finalReportFieldsAdded} // Vô hiệu hóa nếu đã thêm trường
              >
                <Select.Option value="Lưu Nhận">Lưu Nhận</Select.Option>
                <Select.Option value="Ngày Tháng">Ngày Tháng</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Nguoidung;