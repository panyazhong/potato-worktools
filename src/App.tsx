import { useEffect, useState } from "react";
import "antd/dist/reset.css";
import "./App.css";
import { Upload, Button, message, Table, Tabs, Input } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import Big from "big.js";
import { tw } from "twind";

const { Dragger } = Upload;

enum TAB {
  "file" = "file",
  "tcc" = "tcc",
}

function App() {
  const [tabKey, setTabKey] = useState<TAB>(TAB.file);
  const [fileListData, setFileListData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  const [renderList, setRenderList] = useState<any[]>([]);

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "",
    directory: true,
    showUploadList: false,
    beforeUpload: (file) => {
      if (file.type.includes("pdf")) {
        setFileListData((prev) => {
          const item = {
            name: file.name.split("_")[2],
            key: file.name.split("_")[1],
            copyed: false,
          };
          const arr = [...prev, item].sort((a, b) =>
            new Big(a.key).minus(new Big(b.key)).toNumber()
          );

          return arr;
        });
      }
      // console.log(file, fileList);
      // setFileListData((prev) => {
      //   const arr = fileList
      //     .filter((item) => item.type.includes("pdf"))
      //     .map((i) => ({
      //       name: i.name.split("_")[2],
      //       key: i.name.split("_")[1],
      //     }))
      //     .sort((a, b) => new Big(a.key).minus(new Big(b.key)).toNumber());

      //   console.log(arr);
      //   return arr;
      // });
    },
  };

  const copyText = (record: any) => {
    const text = record.name;
    try {
      if (navigator.clipboard) {
        // clipboard api 复制
        navigator.clipboard.writeText(text);
      } else {
        var textarea = document.createElement("textarea");
        document.body.appendChild(textarea);
        // 隐藏此输入框
        textarea.style.position = "fixed";
        textarea.style.clip = "rect(0 0 0 0)";
        textarea.style.top = "10px";
        // 赋值
        textarea.value = text;
        // 选中
        textarea.select();
        // 复制
        document.execCommand("copy", true);
        // 移除输入框
        document.body.removeChild(textarea);
      }

      message.success("复制成功");
    } catch (error) {
      message.error("复制失败，请联系多米");
    }

    const data = { ...record };
    data.copyed = true;

    setFileListData((prev) =>
      prev.map((i) => (i.key === record.key ? { ...data } : i))
    );
  };

  const onSearch = () => {
    setRenderList(() =>
      searchValue
        ? fileListData.filter((i) => i.name === searchValue.trim())
        : [...fileListData]
    );
  };

  useEffect(() => {
    setRenderList(fileListData);
  }, [fileListData]);

  return (
    <div className={tw`w-full h-1vh`}>
      <Tabs activeKey={tabKey.toString()} onChange={(v) => setTabKey(v as TAB)}>
        <Tabs.TabPane
          tab="文件名提取"
          tabKey={TAB.file}
          key={TAB.file}
        ></Tabs.TabPane>
        {/* <Tabs.TabPane tab="TCC" tabKey={TAB.tcc} key={TAB.tcc}></Tabs.TabPane> */}
      </Tabs>
      {tabKey === TAB.file && (
        <>
          <Dragger {...props}>
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
          {/* <Upload
            directory
            showUploadList={false}
            action=""
            onChange={(info) => {
              if (info.file.status !== "uploading") {
                // console.log(info.file, info.fileList);
              }
              if (info.file.status === "done") {
                // message.success(`${info.file.name} file uploaded successfully`);
              } else if (info.file.status === "error") {
                // message.error(`${info.file.name} file upload failed.`);
              }
            }}
            beforeUpload={(file, fileList) => {
              setFileListData((prev) => {
                const arr = fileList
                  .filter((item) => item.type.includes("pdf"))
                  .map((i) => ({
                    name: i.name.split("_")[2],
                    key: i.name.split("_")[1],
                  }))
                  .sort((a, b) =>
                    new Big(a.key).minus(new Big(b.key)).toNumber()
                  );

                console.log(arr);
                return arr;
              });
            }}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload> */}

          <div className={tw`flex my-[20px]`}>
            <Input
              placeholder="输入筛选项"
              className={tw`w-[400px] mr-[20px]`}
              value={searchValue}
              allowClear
              onChange={(v) => {
                setSearchValue(v.target.value);
              }}
            />
            <Button type="primary" onClick={onSearch}>
              搜索
            </Button>
          </div>

          <Table
            style={{
              margin: "20px",
            }}
            rowKey="key"
            sortDirections={["ascend", "descend"]}
            rowClassName={(v) => {
              console.log();
              return v.copyed ? "row__copyed" : "";
            }}
            columns={[
              {
                dataIndex: "index",
                title: "序号",
                render: (val, record, index) => {
                  console.log(val, record);
                  return index + 1;
                },
              },
              {
                dataIndex: "name",
                title: "文件名",
                width: "300px",
              },
              {
                dataIndex: "operate",
                title: "操作",
                render: (value, record) => {
                  console.log(value);
                  return (
                    <Button
                      type="text"
                      onClick={() => {
                        copyText(record);
                      }}
                    >
                      复制
                    </Button>
                  );
                },
              },
              {
                dataIndex: "key",
                title: "key",
                // sorter: (a: any, b: any) => a.key - b.key,
              },
            ]}
            dataSource={renderList}
            pagination={false}
          />
        </>
      )}
    </div>
  );
}

export default App;
