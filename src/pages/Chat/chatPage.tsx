// import ChatBar from "~/pages/Chat/chatBar/chatBar";
// import ChatBody from "~/pages/Chat/chatBody/chatBody";
// import ChatFooter from "~/pages/Chat/chatFooter/chatFooter";
import './style.scss'
import { Layout, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import ChatBar from './chatBar/chatBar';
import ChatBody from './chatBody/chatBody';
import ChatFooter from './chatFooter/chatFooter';
const { Text } = Typography;
const ChatPage = () =>{
  return (
    // <div className="chat-page">
    //    <ChatBar />
    //   <div className="chat-main">
    //   <ChatBody />
    //   <ChatFooter />
    //   </div>
    // </div>
    <Layout style={{height: '80vh'}}>
      <Sider width={300} style={{background: '#fff'}}>
      <ChatBar />
      </Sider>
      <Layout>
      <Header style={{ background: '#fff', padding: '0 24px' }}>
          <Text strong>Chat Header</Text>
        </Header>
        <Content style ={{height: '100%'}}>
          <ChatBody />
        </Content>
        <Footer>
          <ChatFooter/>
        </Footer>
    </Layout>
    </Layout>
    
  )
}
export default ChatPage;