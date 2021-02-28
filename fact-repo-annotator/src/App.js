import React, { useState } from 'react';
import { Button, Header, Container, Segment, Form, Message, Icon} from 'semantic-ui-react';
import './App.css';
import SentenceEntry from './SentenceEntry';
import MetadataEntry from './MetadataEntry';


// Working JSON data to annotate
let working_json_data = {}


function App(props) {



    // The GitHub repo URL
    const URL_FACT_REPO_API = "https://api.github.com/repos/LanguageKits/fact-repo/contents/"
    const URL_FACT_REPO_API_FILE = URL_FACT_REPO_API + "Data/Pending/pending_x.json"

    // delete later: log file content
    //const [fileContent, setFileContent] = useState("");

    // GitHub setup

    const [accessToken, setAccessToken] = useState("");
    const [githubURL, setURL] = useState(URL_FACT_REPO_API_FILE);
    const [githubCommitMessage, setCommitMessage] = useState("Commit changes from the Annotator Tool");

    const [disabledButtonGet, setDisabledButtonGet] = useState("disabled");

    const handleChangeAccessToken = (event) => {
        let value = event.target.value
        setAccessToken( value );
        if ( value.trim() === "") {
            setDisabledButtonGet("disabled")
        }
        else {
            setDisabledButtonGet('')
        }
    }

    const handleChangeURL = event => setURL(event.target.value);
    const handleChangeCommitMessage = event => setCommitMessage(event.target.value);

    // GitHub API metadata, e.g. SHA
    const [fileMetadata, setFileMetadata] = useState();

    // Activity messaging
    const [activityMessage, setActivityMessage] = useState("Welcome");
    const [activityColor, setActivityColor] = useState("blue");

    // Annotation array for document level (metadata) and sentence level
    let [metadata_to_annotate, set_metadata_to_annotate] = useState([]);
    let [sentences_to_annotate, set_sentences_to_annotate] = useState([]);

    // delete later: JSON log file content
    //const [JSONTesting, setJSONTesting] = useState(JSON.stringify(working_json_data, null, 2));

    // Sentence annotation handler
    const handleSentenceAnnotationChange = (index, flag_fact, flag_misinformation,flag_opinion,flag_temporal,flag_ignore, newSentence) => {
        //console.log(index)
        //console.log(flag_fact)
        //console.log(flag_misinformation)
        //console.log(newSentence)
      console.log(flag_ignore)
        working_json_data['sentences'][index]["fact"] = flag_fact
        working_json_data['sentences'][index]["misinformation"] = flag_misinformation
        working_json_data['sentences'][index]["opinion"] = flag_opinion
        working_json_data['sentences'][index]["temporal"] = flag_temporal
          working_json_data['sentences'][index]["ignore"] = flag_ignore
        working_json_data['sentences'][index]["sentence"] = newSentence
        //setJSONTesting(JSON.stringify(working_json_data, null, 2))

        setActivityMessage("Your changes has not been pushed.")
        setActivityColor('yellow')
    }

    const handleMetadataChange = (key, newValue) => {
        //console.log(key + " : " + newValue)
        working_json_data[key] = newValue
        //setJSONTesting(JSON.stringify(working_json_data, null, 2))

        setActivityMessage("Your changes has not been pushed.")
        setActivityColor('yellow')
    }

    // delete later: Changing log file content
    //const handleColorModify = (event) => {
        //setFileContent(event.target.value);
        //setActivityMessage("Your changes has not been pushed.")
        //setActivityColor('yellow')
    //}

    // Upload data to Github
    const handlePushDataFromAPI = (event) => {
        //console.log(githubUsername + " : " + githubPassword)
        //console.log(githubCommitMessage)
        // Setting up API call
        let base64 = require('base-64');
        let utf8 = require('utf8');

        let headers = new Headers();
        headers.append('Content-Type', 'text/json');
        headers.append('Authorization', 'token ' +accessToken  );

        // Encoding the final annotation
        let text = JSON.stringify(working_json_data, null, 4);
        let bytes = utf8.encode(text);
        let encoded = base64.encode(bytes);

        // Replace the data in place (given the SHA)
        fetch(githubURL, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({
                message: githubCommitMessage,
                content: encoded,
                sha: fileMetadata.sha
                })
            }).then(response => {
                return response.json()
            }).then(json => {
                setActivityMessage("Your changes has been pushed")
                setActivityColor('green')
                //console.log(JSON.stringify(json, null, 4))

                working_json_data = {}
                set_sentences_to_annotate([])
                set_metadata_to_annotate([])
            }
            )
    }

    // Getting data from Github
    const handleGetDataFromAPI = (event) => {
        // Messaging activity: Welcome
        setActivityMessage("Welcome")
        setActivityColor('blue')

        // Setting up API call
        let base64 = require('base-64');
        let utf8 = require('utf8');

        let headers = new Headers();
        headers.append('Content-Type', 'text/json');
        headers.append('Authorization', 'token ' +  accessToken);

        fetch(githubURL, {method:'GET',
            headers: headers,
            }).then(res =>
                res.json()
            ).then((result) => {
                // Setting the File metadata to get the SHA later
                setFileMetadata(result)

                // Decoding the file content
                var encoded = result.content;
                var bytes = base64.decode(encoded);
                var text = utf8.decode(bytes);

                // delete later: log file content
                //setFileContent(text);

                // Getting the JSON file
                working_json_data = JSON.parse(text)

                //console.log(working_json_data);
                //console.log(JSON.stringify(working_json_data, null, 2));

                // Creating document level (metadata) elements
                metadata_to_annotate = []
                Object.keys(working_json_data).forEach(function(key) {
                    if (key === "sentences" || key === "annotators") {
                        // skip sentences and annotators
                    }
                    else {
                        metadata_to_annotate.push(
                            //{/*<Form.Input key={key} name={key} label={key} placeholder={key} value={working_json_data[key]} width={16} onChange={handleMetadataChange}/>*/}
                            <MetadataEntry key={key} key_name={key} key_value={working_json_data[key]} handler={handleMetadataChange}/>
                        )
                    }
                });
                set_metadata_to_annotate(metadata_to_annotate)

                // Creating sentence level elements
                sentences_to_annotate = []
                for (const [index] of working_json_data["sentences"].entries()) {
                    const sentence = working_json_data['sentences'][index]["sentence"]
                    const id_sentence = working_json_data['sentences'][index]["id"]
                    const flag_fact = working_json_data['sentences'][index]["fact"]
                    const flag_misinformation = working_json_data['sentences'][index]["misinformation"]
                    const flag_opinion = working_json_data['sentences'][index]["opinion"]
                    const flag_temporal = working_json_data['sentences'][index]["temporal"]
                    const flag_ignore = working_json_data['sentences'][index]["ignore"]
                    sentences_to_annotate.push(
                        <SentenceEntry key={index} index={index} sentence={sentence} id_sentence={id_sentence} handler={handleSentenceAnnotationChange}
                            flag_fact={flag_fact} flag_misinformation={flag_misinformation} flag_opinion={flag_opinion} flag_temporal={flag_temporal} flag_ignore={flag_ignore}>
                        </SentenceEntry>
                    )
                }
                set_sentences_to_annotate(sentences_to_annotate)

                // delete later: JSON log file content
                //setJSONTesting(JSON.stringify(working_json_data, null, 2))
            },(error) => {
            }
            )
    };

// Rendering start here
    return (
        <div className="App">
            <br/>
            <Header as='h1' content='Fact Repo Annotator' />

            {/* GitHub setup  */}
            <Container textAlign='left'>
                <Segment.Group>
                    <Segment>
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Input fluid label='Personal access token' placeholder='Access Token' value={accessToken} onChange={handleChangeAccessToken}/>

                            </Form.Group>
                            <Form.Input fluid label='File Github URL'  value={githubURL} onChange={handleChangeURL}/>
                            <Button className={disabledButtonGet} type='submit' onClick={handleGetDataFromAPI} color="green"><Icon name='download' />Get Data</Button>
                            {/*<Button size="small" basic>Test</Button>*/}
                        </Form>
                        <Message warning color={activityColor}>
                            <Icon name='github' />
                            {activityMessage}
                        </Message>
                    </Segment>
                </Segment.Group>

                {/* Document level (metadata) elements */}
                { metadata_to_annotate.length > 0 ?
                    <div>
                    <Message attached
                        header='This is document level annotation'
                        content='Fill the metadata for the document'
                    />
                    <Form className='attached fluid segment'>
                        {metadata_to_annotate}
                    </Form>
                    <Message attached='bottom' warning>
                        <Icon name='bullhorn' />
                        Please be aware that most metadata fields doesn't need to be updated.
                    </Message>
                    </div>
                    :""
                }

                {/* Sentence level elements */}
                { sentences_to_annotate.length > 0 ?
                    <div><br/>
                    <Message attached
                        header='This is sentence level annotation'
                        content='Assign the annotation for each sentences in the document'
                    />
                    {sentences_to_annotate}
                    <Message attached='bottom' warning>
                        <Icon name='bullhorn' />
                        Please go through your annotation before submitting the changes.
                    </Message>

                    <Segment.Group>
                        <Segment>
                            <Form>
                                {/*<TextArea placeholder="" value={fileContent} onChange={handleColorModify}></TextArea>
                                <p>***</p>*/}
                                    <Form.Input fluid label='Commit Message' placeholder='Change the data' value={githubCommitMessage} onChange={handleChangeCommitMessage}/>
                                    <Button className={disabledButtonGet} type='submit' color="green" onClick={handlePushDataFromAPI}><Icon name='upload' />Push Changes</Button>
                            </Form>
                            <Message warning color={activityColor}>
                                <Icon name='github' />
                                {activityMessage}
                            </Message>
                        </Segment>
                    </Segment.Group>
                    </div>
                    :""
                }
                {/*<Segment.Group>
                    <Segment textAlign='left'>
                        <p> {JSONTesting}</p>
                    </Segment>
                </Segment.Group>*/}

            </Container>
        </div>
    );
}
export default App;
