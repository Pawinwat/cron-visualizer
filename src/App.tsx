import { Button, Col, ConfigProvider, Divider, Form, InputNumber, Layout, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import ScheduleEye from './components/charts/ScheduleEye';
import YearlyChart from './components/charts/YearlyChart';
import CronTextField from './components/input/CronTextField';
import { palette } from './theme';
import cronstrue from 'cronstrue';

const { Title, Text } = Typography;

const App: React.FC = () => {
  const [cronExpression, setCronExpression] = useState<string>('');
  const [year, setYear] = useState<number>(new Date().getFullYear()); // Default to current year
  const [timeZone, setTimeZone] = useState<number>(0); // Default to UTC
  const cronArr = cronExpression?.split(' ')
  const cronValid = cronArr.length == 5
  const validYear = cronValid && (cronArr?.[2] != '*')
  // const validDay = cronValid && (cronArr?.[1] != '*')

  const [darkMode, setDarkMode] = useState<boolean>(true);
  const token = {
    colorBgBase: darkMode ? palette.dark.bgColor : palette.light.bgColor,
    colorTextBase: darkMode ? '#f0f0f0' : '#000000',
    fontFamily: '"Courier New", Courier, monospace',
  };
  const description = cronstrue.toString(cronExpression, { throwExceptionOnParseError: false });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <Form>
    <ConfigProvider theme={{ token }}>
      <Layout
        style={{
          minHeight: '100vh',
          margin: 0,
          border: 'none',
          padding: '20px',
        }}
      >
        <Row justify="center">
          <Col span={16}>
            <Title level={2} style={{ textAlign: 'center', color: darkMode ? '#f0f0f0' : '#000000' }}>
              Cron Expression Visualizer
            </Title>

            <CronTextField value={cronExpression} onChange={setCronExpression} style={{ marginBottom: '20px' }} />

            {/* Year and Time Zone Selector */}
            <div style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', gap: 20 }}>
              <div style={{ marginBottom: '10px' }}>
                <Text style={{ color: darkMode ? '#f0f0f0' : '#000000', marginRight: '10px' }}>Year:</Text>
                <InputNumber
                  size="large"
                  min={1900}
                  max={2100}
                  value={year}
                  placeholder="Year"
                  onChange={(value) => value && setYear(value)}
                  style={{ width: '120px' }}
                />
              </div>

              <div>
                <Text style={{ color: darkMode ? '#f0f0f0' : '#000000', marginRight: '10px' }}>Time Zone Offset (UTC):</Text>
                <InputNumber
                  size="large"
                  min={-12}
                  max={+12}
                  value={timeZone}
                  placeholder="Offset"
                  onChange={(value) => setTimeZone(value || 0)}
                  style={{ width: '120px' }}
                  formatter={(value) => (value !== undefined && value > 0 ? `+${value}` : `${value}`)}

                />
              </div>
            </div>
           <Text>
              {cronValid?description:''}
            </Text>
            <Divider style={{ borderColor: darkMode ? '#f0f0f0' : '#000000' }} />
            {validYear && <YearlyChart cronExpression={cronExpression} year={year} />}
            {cronExpression && <ScheduleEye cronExpression={cronExpression} timeZoneOffset={timeZone} />}

            <Button onClick={() => setDarkMode(!darkMode)} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
              Toggle Dark Mode
            </Button>
          </Col>
        </Row>
      </Layout>
    </ConfigProvider>
    </Form>
  );
};

export default App;
