import {
  Alert,
  Button,
  message,
  Table,
  TableProps,
  Upload,
  UploadProps,
} from "antd";
import { useState } from "react";
import { tw } from "twind";
import { InboxOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

const { Dragger } = Upload;

const MergeFile = () => {
  const [fileList, setFileList] = useState<any[]>([]);

  const typeList = ["xlsx", "slxm", "xlsb", "sltx", "xls", "cvs"];
  const update = () => {};
  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "",
    showUploadList: false,
    beforeUpload: (file) => {
      const type = file.name.split(".").reverse()[0];
      console.log(type);
      if (typeList.includes(type)) {
        const reader = new FileReader();

        reader.onload = (e) => {
          console.log(e);
          const data = e.target.result;

          setFileList((prev) => [...prev, { data, name: file.name }]);
        };

        reader.readAsArrayBuffer(file);
      }
    },
  };

  const rowSelection: TableProps<any>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };
  const outputFile = "merged.xlsx";
  const mergeFile = () => {
    if (!fileList.length) return;

    const wb = XLSX.utils.book_new();

    fileList.forEach((file, index) => {
      try {
        const workbook = XLSX.read(file.data, {
          type: "buffer",
        });
        console.log(workbook);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const newSheetName = file.name.split(".")[0];
        XLSX.utils.book_append_sheet(wb, worksheet, newSheetName);
      } catch (error) {
        console.error(`读取文件 ${file} 时出错:`, error);
      }
    });

    XLSX.writeFile(wb, outputFile);
    message.success(`合并完成，文件已保存为 ${outputFile}`);
  };

  return (
    <div className={tw`flex flex-col gap-4 w-full`}>
      <Alert
        message={
          <div className={tw`flex flex-col items-start gap-2`}>
            <span>1、上传需要合并的文件</span>
            <span>2、选择需要合并的文件</span>
            <span>3、点击merge按钮</span>
            <span>4、下载合并后的文件</span>
          </div>
        }
        type="info"
      />
      <div className={tw`w-full h-full flex flex-col gap-4`}>
        <Dragger {...props} className={tw`w-[50%]!`}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Dragger>

        <Table
          columns={[
            {
              dataIndex: "name",
              title: "文件",
            },
          ]}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          dataSource={fileList}
          rowKey={"name"}
        ></Table>
      </div>

      <Button onClick={mergeFile}>merge</Button>
    </div>
  );
};

export default MergeFile;
