import { Button, ColorPicker, Form, InputNumber } from 'antd';
import './index.less'
import { useEffect, useState } from 'react';
import { getLocalStorage, saveLocalStorage } from '@/utils';

export const SETTINGS_KEY = 'settings-value';
const MAIN_COLOR = "#7ce5ef";
const COLOR_ACTIVE = "#f4bff4";
const BORDER_RADIUS = "20";
export const DEFAULT_SETTINGS_VALUE = { mainColor: MAIN_COLOR, colorActive: COLOR_ACTIVE, borderRadius: BORDER_RADIUS }

export default function Settings() {
  const [form] = Form.useForm();
  const [settingsValue, setSettingsValue] = useState(getLocalStorage(SETTINGS_KEY, DEFAULT_SETTINGS_VALUE))
  
  useEffect(() => {
    const item = getLocalStorage(SETTINGS_KEY, DEFAULT_SETTINGS_VALUE)
    form.setFieldsValue({
      mainColor: item.mainColor,
      colorActive: item.colorActive,
      borderRadius: item.borderRadius,
    })
  }, [settingsValue, form])

  const onSubmit = (values: any) => {
    form.setFieldsValue({})
    console.log('values', values);
    const mainColor_t = typeof values.mainColor==='string'?values.mainColor:values.mainColor.toHexString();
    const colorActive_t = typeof values.colorActive==='string'?values.colorActive:values.colorActive.toHexString();
    const borderRadius_t = values.borderRadius;
    console.log('main', mainColor_t);
    console.log('active', colorActive_t)
    setSettingsValue({ mainColor: mainColor_t, colorActive: colorActive_t, borderRadius: borderRadius_t })
    saveLocalStorage(SETTINGS_KEY, { mainColor: mainColor_t, colorActive: colorActive_t, borderRadius: borderRadius_t })
  }

   useEffect(()=>{
      const settingsValue=getLocalStorage(SETTINGS_KEY,DEFAULT_SETTINGS_VALUE);
      var root = document.documentElement;
      root.style.setProperty('--color', settingsValue.mainColor);
      root.style.setProperty('--active', settingsValue.colorActive);
      root.style.setProperty('--radius', `${settingsValue.borderRadius}px`);
      console.log(`${settingsValue.borderRadius}px`)
    },[settingsValue])

  return (
    <>
      <div className='tabbar'></div>
      <div className='settings-form'>
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 200 }}
          style={{ maxWidth: 1130 }}
          onFinish={onSubmit}
          labelAlign='left'
          autoComplete="off"
          size='large'
        >
          <Form.Item
            label="主题色"
            name="mainColor"
            rules={[{ required: true, message: '请选择颜色!' }]}
          >
            <ColorPicker 
            format='hex' 
            showText 
            placement='bottomRight'
            />
          </Form.Item>
          <Form.Item
            label="主题色(激活状态)"
            name="colorActive"
            rules={[{ required: true, message: '请选择颜色！' }]}
          >
            <ColorPicker format='hex' showText placement='bottomRight' />
          </Form.Item>
          <Form.Item
            label="圆角"
            name="borderRadius"
            rules={[{ required: true, message: '请输入数字！' }]}
          >
            <InputNumber addonAfter="px" />
          </Form.Item>
          {/* <Form.Item label={false}> */}
            <Button className="button" type="primary" htmlType="submit" >
              确认修改
            </Button>
          {/* </Form.Item> */}
        </Form>
      </div>
    </>
  );
}
