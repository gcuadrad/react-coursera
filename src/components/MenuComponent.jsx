import React from 'react';
import { Card, CardImg, CardImgOverlay, CardTitle } from 'reactstrap';

function RenderMenuItem ({dish, onClick}){
  return(
    <div  key={dish.id} className="col-12 col-md-5 m-1">
      <Card>
        <CardImg width="100%" src={dish.image} alt={dish.name} />
        <CardImgOverlay>
            <CardTitle>{dish.name}</CardTitle>
        </CardImgOverlay>
      </Card>
    </div>
  );
}

const Menu = (props) => {
  const menu = props.dishes.map((dish) => {
    return (
      <RenderMenuItem dish={dish} />
    );
  });

  return(
    <div className="row">
      {menu}
    </div>
  );
}

export default Menu;
