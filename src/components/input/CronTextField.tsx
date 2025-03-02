import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Input, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { validateCron } from '../../utils/cronUtils';
import { debounce } from 'lodash';

// Type definition for props
interface CronTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  [key: string]: any;  // Additional props passed to Form.Item
}

const CronTextField: React.FC<CronTextFieldProps> = ({ value, onChange, ...props }) => {
  const [inputValue, setInputValue] = useState(value);

  // Debounce the input change to avoid excessive updates
  const debouncedChange = debounce((newValue: string) => {
    onChange(newValue);
  }, 500); // 500ms delay

  // Update local state and trigger debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue?.split(' ')?.length < 5) return;
    setInputValue(newValue);
    debouncedChange(newValue);
  };

  useEffect(() => {
    setInputValue(value); // Sync state if external value changes
  }, [value]);

  return (
    <Form.Item
      name="cron"
      validateTrigger="onBlur"
      rules={[
        {
          validator: async (_, cron) => {
            await validateCron(cron);
          },
        },
      ]}
      {...props}
      style={{ width: '100%' }}
    >
      <Input
        value={inputValue}
        onChange={handleChange}
        placeholder="* * * * *"
        size="large"
        style={{
          height: '80px',

        }}
        styles={{
          input: {
            fontSize: '48px',
            textAlign: 'center', // Center the text horizontally
          }
        }}
        suffix={
          <Tooltip title="Cron format example: '*/5 * * * *'">
            <InfoCircleOutlined />
          </Tooltip>
        }
      />
    </Form.Item>
  );
};

export default CronTextField;
