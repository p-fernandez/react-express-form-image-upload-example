import React from 'react';

class PostUpload extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      imagePreviewUrl: '',
      status: 'idle',
      statusMsg: (<p>Click or drop files here to upload</p>),
      style: {},
      value: ''
    };

    this.uploadFile = '';
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.onDragOver = this.onDragOver.bind(this);
    // this.onDragLeave = this.onDragLeave.bind(this);
    // this.setOriginalText = this.setOriginalText.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();
    if(!this.uploadFile){
      return;
    }
    let data = new FormData();
    data.append('imageSrc', this.uploadFile);
    data.append('post', this.state.value);
    console.log(...data);

    fetch('http://localhost:4400/api/images', {
      method: 'POST',
      body: data,
    }).then((res) => {
      console.log(res);
      this.setState({
        status: 'uploading',
        statusMsg: (<p>Uploading...</p>)
      });
      return res.json();
    }).then((val) => {
      if(val.message === 'ok'){
        this.setState({
          status: 'done',
          statusMsg: (<p id='checkMark'><i className="fa fa-check"></i></p>)
        });
        console.log(val);

        // timer = _.delay(this.setOriginalText, 1000);
      }
    }).catch(error =>{
      return error;
    });
  }

  handleTextChange(e){
    this.setState({value: e.target.value});
  }

  handleImageChange(e){
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result,
        style: {background: ''}
      });
      this.uploadFile = file;
    };
    
    reader.readAsDataURL(file);
  }
  
  render(){
    let{imagePreviewUrl} = this.state;
    let imagePreview = this.state.statusMsg;
    if(imagePreviewUrl){
      imagePreview = (<img src={imagePreviewUrl} alt={this.state.value} className="dropPreview" />);
    }
    return(
      <div className="container">
        <form>
          <div
            // onDragOver={this.onDragOver}
            // onDragLeave={this.onDragLeave}
            className="dropZoneContainer">

            <div className="dropZone" id="upload-file-container" style={this.state.style}>{imagePreview}
              <input type="file" name="imageSrc" onChange={this.handleImageChange} />
            </div>

            <label htmlFor="post">Post:</label> 
              
              <textarea value={this.state.value} name="post" placeholder="Write something related to the picture" onChange={this.handleTextChange} />
                     
          </div>
          <a href="" onClick={this.handleSubmit} className="icon-button cloudicon">
              <i className="fa fa-cloud-upload"></i><span>Post</span>
          </a>
        </form>
      </div>
    );
  }
}

export default PostUpload;
