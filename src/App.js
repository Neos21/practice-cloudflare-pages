import React from 'react';

import './App.css';

/** App */
class App extends React.Component {
  /**
   * Constructor
   * 
   * @param {*} props Props
   */
  constructor(props) {
    super(props);
    this.state = {
      text   : 'Initializing...',  // API からコンテンツをロードするまでに表示しておく内容
      message: 'Initializing...'   // メッセージ
    };
  }
  
  
  // Events
  // ================================================================================
  
  /** 初期表示時 */
  componentDidMount() {
    console.log(`Component Did Mount : API URL [${process.env.REACT_APP_API_URL}]`);
    
    if(process.env.REACT_APP_API_URL == null || String(process.env.REACT_APP_API_URL) === '') {
      this.updateText('');
      this.updateMessage('Error', true);
      return console.error('Component Did Mount : Error : Environment Variable [REACT_APP_API_URL] Is Not Defined');
    }
    
    this.onLoad(true);
  }
  
  /**
   * ノートを読み込む
   * 
   * @param {boolean} isRemoveTextOnError エラー時にテキストを空にする場合は `true`
   */
  onLoad = async (isRemoveTextOnError = false) => {
    console.log('On Load');
    this.updateMessage('Loading...', true);
    
    try {
      const response = await window.fetch(process.env.REACT_APP_API_URL);
      const json = await response.json();
      if(json.text == null) throw new Error('Invalid Response JSON : The [text] Property Does Not Exist');
      
      console.log('On Load : Success', json.text);
      this.updateText(json.text);
      this.updateMessage('Loaded');
    }
    catch(error) {
      console.error('On Load : Error', error);
      this.updateMessage('Failed To Load');
      if(isRemoveTextOnError) this.updateText('');
    }
  }
  
  /** ノートを保存する */
  onSave = async () => {
    console.log('On Save', this.state.text);
    this.updateMessage('Saving...', true);
    
    try {
      await window.fetch(process.env.REACT_APP_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: this.state.text })
      });
      
      console.log('On Save : Success');
      this.updateMessage('Saved');
    }
    catch(error) {
      console.error('On Save : Error', error);
      this.updateMessage('Failed To Save');
    }
  }
  
  /**
   * テキストエリアの値を Props に反映する
   * 
   * NOTE : `form` 要素内にないテキストエリアを入力可能にするためには `onChange` 指定が必要
   * 
   * @param {Event} event Event
   */
  changeText = event => {
    this.updateText(event.target.value);
    this.updateMessage('', true);
  }
  
  
  // Common
  // ================================================================================
  
  /**
   * テキストを更新する
   * 
   * @param {string} text テキスト
   */
  updateText = text => this.setState({ text });
  
  /**
   * メッセージを更新し数秒後に非表示にする
   * 
   * @param {string} message メッセージ
   * @param {boolean} isNotSetTimeout メッセージを非表示にする `setTimeout()` を予約しない場合は `true` にする
   */
  updateMessage = (message, isNotSetTimeout = false) => {
    this.setState({ message });
    if(!isNotSetTimeout) setTimeout(() => this.setState({ message: '' }), 2000);
  }
  
  /** Render */
  render() {
    return (
      <div className="App">
        { /* eslint-disable-next-line */ }
        <h1 className="title"><a href="https://neos21.net/" target="_blank" title="Author : Neo">Shared Note</a></h1>
        <div className="message">{this.state.message}</div>
        <button type="button" onClick={this.onLoad} className="load">Load</button>
        <button type="button" onClick={this.onSave} className="save">Save</button>
        <textarea placeholder="Please Input Text" value={this.state.text} onChange={this.changeText} className="text"></textarea>
      </div>
    );
  }
}

export default App;
