import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button,
         Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Label } from 'reactstrap';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';
import { Link } from 'react-router-dom';
import Loading from './LoadingComponent';
import { Control, LocalForm, Errors } from 'react-redux-form';
import  { baseUrl } from '../shared/baseUrl';

const minLength = (len) => (val) => val && (val.length >= len);
const maxLength = (len) => (val) => !(val) || (val.length <= len);

class CommentForm extends Component {
  handleSubmit(values){
    this.props.onToggleModal();
    this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
  }

  render(){
    const { showModal, onToggleModal } = this.props;
    return(
      <Modal isOpen={showModal} toggle={onToggleModal}>
        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
          <ModalHeader toggle={onToggleModal}>Submit Comment</ModalHeader>
          <ModalBody>
            <Row className="form-group">
              <Label htmlFor="rating" md={2}>Rating</Label>
                <Col md={10}>
                    <Control.select
                      model=".rating"
                      name="rating"
                      className="form-control"
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </Control.select>
                </Col>
            </Row>
            <Row className="form-group">
              <Label htmlFor="author" md={2}>Your Name</Label>
              <Col md={10}>
                  <Control.text
                    model=".author"
                    id="author"
                    name="author"
                    placeholder="Your Name"
                    className="form-control"
                    validators={{
                        minLength: minLength(3),
                        maxLength: maxLength(15)
                    }}
                  />
                  <Errors
                      className="text-danger"
                      model=".author"
                      show="touched"
                      messages={{
                          minLength: 'Must be greater than 3 characters',
                          maxLength: 'Must be 15 characters or less'
                      }}
                   />
              </Col>
            </Row>
            <Row className="form-group">
                <Label htmlFor="comment" md={2}>Comment</Label>
                <Col md={10}>
                    <Control.textarea
                      model=".comment"
                      id="comment"
                      name="comment"
                      rows="12"
                      className="form-control"
                    />
                </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary">Submit</Button>
          </ModalFooter>
        </LocalForm>
      </Modal>
    );
  }
}

function RenderDish({dish}){
  return(
    <div className="col-12 col-md-5 m-1">
      <FadeTransform in
        transformProps={{
          exitTransform: 'scale(0.5) translateY(-50%)'
        }}>
        <Card>
          <CardImg top src={`${baseUrl}${dish.image}`} alt={dish.name} />
          <CardBody>
            <CardTitle>{dish.name}</CardTitle>
            <CardText>{dish.description}</CardText>
          </CardBody>
        </Card>
      </FadeTransform>
    </div>
  );
}

class RenderComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
    this.handleToggleModal = this.handleToggleModal.bind(this);
  }

  handleToggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  render() {
    const {comments} = this.props;
    if (comments != null) {
      return (
        <div className="col-12 col-md-5 m-1">
          <h4>Comments</h4>
          <ul className="list-unstyled">
            <Stagger in>
              {comments.map((comment) => {
                return (
                  <Fade in>
                    <li>
                      <p>{comment.comment}</p>
                      <p>
                        -- {comment.author},{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        }).format(new Date(Date.parse(comment.date)))}
                      </p>
                    </li>
                  </Fade>
                );
              })}
            </Stagger>
          </ul>
          <Button color="default" onClick={this.handleToggleModal}>
            Submit Comment
          </Button>
          <CommentForm
            onToggleModal={this.handleToggleModal}
            showModal={this.state.showModal}
            dishId={this.props.dishId}
            postComment={this.props.postComment}
          />
        </div>
      );
    } else {
      return(
        <div></div>
      );
    }
  }
}


const DishDetail = (props) => {
  if (props.isLoading) {
    return(
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  } else if (props.errMess) {
    return(
      <div className="container">
        <div className="row">
          <h4>{props.errMess}</h4>
        </div>
      </div>
    );
  } else if (props.dish != null){
    return(
      <div className="container">
        <div className="row">
          <Breadcrumb>
              <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
              <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            <h3>{props.dish.name}</h3>
            <hr />
          </div>
        </div>
        <div className="row">
          <RenderDish dish={props.dish} />
          <RenderComments
            comments={props.comments}
            postComment={props.postComment}
            dishId={props.dish.id}
          />
        </div>
      </div>
    );
  }
}

export default DishDetail;
