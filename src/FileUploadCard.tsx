import axios from 'axios';
import { Activity, CardAction, Message} from 'botframework-directlinejs';
import * as moment from 'moment';
import * as React from 'react';
import ReactDatePicker from 'react-datepicker';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { getAvailableTimes } from './getAvailableTimes';
import { ChatState } from './Store';
import { ChatActions, sendFiles , sendMessage } from './Store';

export interface Node {
    node_type: string;
    upload_url: string;
}

interface FileUploadProps {
    node: Node;
    submitFile: () => any;
    sendMessage: (inputText: string) => void;
    sendFiles: (files: FileList) => void;
}

export interface MessageWithDate extends Message {
    selectedDate: moment.Moment;
}

export interface FileUploadState {
    files: any;
    previewFile: boolean;
    isUploading: boolean;
}

/**
 * File Upload card which renders in response to node of types 'file'
 * Used for file upload
 */
class FileUpload extends React.Component<FileUploadProps, FileUploadState> {
    constructor(props: FileUploadProps) {
        super(props);

        this.state = {
            files: [],
            previewFile: false,
            isUploading: false
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    removeFile = () => {
        this.setState({
            files: [],
            previewFile: false
        });
    }

    private handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): any {
        if (!this.state.previewFile) { return; }

        if (e.key === 'Enter') {
            console.log('enter');
            this.props.submitFile();
            this.props.sendFiles(this.state.files);
            document.removeEventListener('keypress', this.handleKeyDown.bind(this));
        }
    }

    handleSkipFile(e: React.MouseEvent<HTMLDivElement>) {
        this.props.sendMessage('SKIP_UPLOAD');
    }

    clickToSubmitFile(e: React.MouseEvent<HTMLDivElement>) {
        if (!this.state.previewFile) { return; }

        this.setState({isUploading: true});
        for (let i = 0, numFiles = this.state.files.length; i < numFiles; i++) {
            const file = this.state.files[i];
            axios.get( this.props.node.upload_url)
              .then((result: any) => {
                const signedUrl = result.data.signedUrl;

                const options = {
                  headers: {
                    'Content-Type': file.type
                  }
                };

                return axios.put(signedUrl, file, options);
              })
              .then((result: any) => {
                this.setState({isUploading: false});
                this.props.sendMessage(file.name);
              })
              .catch(err => {
                this.setState({isUploading: false});
                console.log('error', err);
                this.props.sendMessage('Docs not uploaded successfully.');
              });
        }

        // this.props.submitDate();
        // this.props.sendMessage(this.state.files);
        document.removeEventListener('keypress', this.handleKeyDown.bind(this));

        e.stopPropagation();
    }

    onDrop(imageFiles: FileList) {
        if (imageFiles.length > 0) {
            this.setState({
                files: imageFiles,
                previewFile: true
            });
        }
      }

      showDropzone = () => {
          let returnDropzone = (
            <div>
                <div className="file-upload-title">Upload your docs</div>
                <Dropzone
                onDrop={this.onDrop.bind(this)}
                >
                    <div className="drop-text">
                        <span className="bold-line"> Drop files here to upload</span>
                        <br/>
                        <span>or <br/> click here to select files </span>
                    </div>
                </Dropzone>
                <div className="upload-skip" onClick={e => this.handleSkipFile(e) }>Skip</div>
            </div>
          );
          if (this.state.previewFile) {
            returnDropzone = (
                <div>
                    <div className="file-upload-title">{this.state.files[0].name}</div>
                    <div className="file_chunk no-border">
                        <div className="drop-text add-padding">
                            <div className="fileAttach"></div>
                            <span className="bold-line">{this.state.files[0].name} </span>
                            <br/>
                            <a onClick={this.removeFile} className="remove_link" href="#"> remove file</a>
                        </div>
                    </div>
                    <div className="upload-skip" onClick={e => this.clickToSubmitFile(e) }>Press Enter to Submit</div>
                </div>
              );
        }

          return returnDropzone;

      }

    render() {
        const { node } = this.props;

        return (
            <div className="fileUpload">
                { (this.state.isUploading) ? <div className="loading"></div> : null}
                { this.showDropzone() }
            </div>
        );
    }
}

export const FileUploadCard = connect(
    (state: ChatState) => ({
        // passed down to MessagePaneView
        locale: state.format.locale,
        user: state.connection.user
    }), {
        submitFile: () => ({ type: 'Submit_File' } as ChatActions),
        sendMessage,
        sendFiles
    }, (stateProps: any, dispatchProps: any, ownProps: any): FileUploadProps => ({
        node: ownProps.node,
        submitFile: dispatchProps.submitFile,
        sendMessage: (text: string) => dispatchProps.sendMessage(text, stateProps.user, stateProps.locale),
        sendFiles: (files: FileList) => dispatchProps.sendFiles(files, stateProps.user, stateProps.locale)
    })
)(FileUpload);
