import React, { useState } from 'react';
import {Segment, Grid, Button, Modal, Icon, TextArea, Form} from 'semantic-ui-react';

//const ANNOTATION_FACT = false
//const ANNOTATION_MISINFORMATION = false
//const [sentenceId, setSentenceId] = useState();
//const [annotationFact, setAnnotationFact] = useState(ANNOTATION_FACT);
//const [annotationMisinformation, setAnnotationMisinformation] = useState(ANNOTATION_MISINFORMATION);

const annotationColorButton = {
    true: 'green', false: ""
}
const annotationBasicButton = {
    true: '', false: "basic"
}




function SentenceEntry(props) {
    //const [index, setIndex] = useState(props.index)
    const index = props.index
    const [flag_fact, setFlagFact] = useState(props.flag_fact)
    const [flag_misinformation, setFlagMisinformation] = useState(props.flag_misinformation)
    const [flag_opinion, setFlagOpinion] = useState(props.flag_opinion)
    const [flag_temporal, setFlagTemporal] = useState(props.flag_temporal)
    const [flag_ignore, setFlagIgnore] = useState(props.flag_ignore)
    const [working_sentence, setWorkingSentence] = useState(props.sentence)
    const [approved_sentence, setApprovedSentence] = useState(props.sentence)
    const [open_state, setOpenState] = useState(false)

    const handleSentenceChange = (event) => {
        setWorkingSentence(event.target.value);
    }
    const approveSentenceChange = (event) => {
            setWorkingSentence(working_sentence);
            setApprovedSentence(working_sentence);
            setOpenState(false)

            setFlagFact(flag_fact)
            setFlagMisinformation(flag_misinformation)
            setFlagOpinion(flag_opinion)
            setFlagTemporal(flag_temporal)
            setFlagIgnore(flag_ignore)

            props.handler(index, flag_fact, flag_misinformation,flag_opinion,flag_temporal,flag_ignore, working_sentence);
    }
    const handleNewChange = (event) => {
            setWorkingSentence(approved_sentence);
            setOpenState(true)
        }
    const handleNoChange = (event) => {
            setWorkingSentence(approved_sentence);
            setOpenState(false)
            //console.log(approved_sentence)
        }


    function handleChange(event) {
  
        // Here, we invoke the callback with the new value
        if (event.target.value === "FACT") {
            setFlagFact(true)
            setFlagMisinformation(false)
            setFlagOpinion(false)
            setFlagIgnore(false)
            props.handler(index, true, flag_misinformation,flag_opinion,flag_temporal,flag_ignore, approved_sentence);
        }
        else if (event.target.value === "MISINFORMATION") {
            setFlagFact(false)
            setFlagMisinformation(true)
            setFlagOpinion(false)
            setFlagIgnore(false)
            props.handler(index, flag_fact, true,flag_opinion,flag_temporal, flag_ignore,approved_sentence);
        }
        else if (event.target.value === "OPINION") {
            setFlagFact(false)
            setFlagMisinformation(false)
            setFlagOpinion(true)
            setFlagIgnore(false)
            props.handler(index, flag_fact, flag_misinformation,true,flag_temporal, flag_ignore,approved_sentence);
        }
        else if (event.target.value === "TEMPORAL") {
              setFlagTemporal(!flag_temporal)
              setFlagIgnore(false)
              props.handler(index, flag_fact, flag_misinformation,flag_opinion,true,flag_ignore, approved_sentence);
        }
        else if (event.target.value === "IGNORE") {
              setFlagTemporal(false)
              setFlagFact(false)
              setFlagOpinion(false)
              setFlagMisinformation(false)
              setFlagIgnore(true)
              props.handler(index, flag_fact, flag_misinformation,flag_opinion,flag_temporal,true, approved_sentence);
        }
        else if (event.target.value === "NONE") {
            setFlagFact(false)
            setFlagMisinformation(false)
            setFlagTemporal(false)
            setFlagOpinion(false)
            setFlagIgnore(false)

              props.handler(index, flag_fact, flag_misinformation,flag_opinion,flag_temporal,flag_ignore, approved_sentence);
        }
        //props.handler(index, flag_fact, flag_misinformation, approved_sentence);
      }

    return (
        <Segment vertical attached>
            <Grid padded divided>
                <Grid.Row>
                    <Grid.Column floated='left' width={2}>
                        <Segment vertical>id.{props.id_sentence}</Segment>
                        {/*<Segment vertical><Button icon="edit"/></Segment>*/}
                        <Segment vertical>
                        <Modal size="small" open={open_state} trigger={<Button icon="edit" onClick={handleNewChange}/>}>
                            <Modal.Header>Change sentence id {props.id_sentence}</Modal.Header>
                            <Modal.Content >

                              <Modal.Description>
                                 <Form>
                                    <TextArea value={working_sentence} onChange={handleSentenceChange}/>
                                  </Form>
                              </Modal.Description>
                            </Modal.Content>
                            <Modal.Actions>
                                  <Button basic onClick={handleNoChange}>
                                    <Icon name='remove'/> Cancel
                                  </Button>
                                  <Button color='green' inverted onClick={approveSentenceChange}>
                                    <Icon name='checkmark' /> Change
                                  </Button>
                                </Modal.Actions>
                          </Modal>
                          </Segment>
                    </Grid.Column>
                    <Grid.Column floated='left' width={14}   >
                        <Segment vertical textAlign='left'>
                            {/*<Form>
                                <TextArea defaultValue={working_sentence}/>
                            </Form>*/}
                            {approved_sentence}
                        </Segment>
                        <Segment vertical floated='right'>
                            <Button.Group size="small" >
                                <Button className={annotationBasicButton[flag_fact]} value="FACT" color={annotationColorButton[flag_fact]} onClick={handleChange}>Fact</Button>
                                <Button className={annotationBasicButton[flag_misinformation]} value="MISINFORMATION" color={annotationColorButton[flag_misinformation]} onClick={handleChange}>Misinformation</Button>
                                <Button className={annotationBasicButton[flag_opinion]} value="OPINION" color={annotationColorButton[flag_opinion]} onClick={handleChange}>Opinion</Button>
                                <Button className={annotationBasicButton[flag_temporal]} value="TEMPORAL" color={annotationColorButton[flag_temporal]} onClick={handleChange}>Temporal</Button>
                                <Button className={annotationBasicButton[flag_ignore]} value="IGNORE" color={annotationColorButton[flag_ignore]} onClick={handleChange}>Ignore</Button>
                            </Button.Group>
                            &nbsp; &nbsp; &nbsp;
                            <Button className={annotationBasicButton[[!flag_fact && !flag_misinformation && !flag_opinion && !flag_ignore]   ]} size="small" value="NONE" color={annotationColorButton[!flag_fact && !flag_misinformation && !flag_opinion && !flag_ignore]} onClick={handleChange}>None</Button>
                        </Segment>
                    </Grid.Column>

                </Grid.Row>

            </Grid>
        </Segment>
    )
}

export default SentenceEntry;
