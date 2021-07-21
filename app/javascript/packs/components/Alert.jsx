import { message } from 'antd';

const success = () => {
    message.success('This is a prompt message for success, and it will disappear in 10 seconds', 10);
};

export default success;