import React from "react";
import {
  Container,
  Header,
  Menu,
  Button,
  List,
  Image
} from "semantic-ui-react";

class App extends React.Component {

  state = {
    bookApi: [],
    clickedBook: {},
    clickedBookId: "",
  }

  componentDidMount = () =>{
    fetch("http://localhost:3000/books")
    .then(r => r.json())
    .then(data => this.setState(prevState=> ({bookApi: data})))
  }

  clickHandler = (bookObj) =>{
    // console.log(bookObj)
    let liked = () =>{
      if(bookObj.users.find(book => JSON.stringify(book) === JSON.stringify({id: 1, username: 'pouros'}))){
        return true
      }
      return false
    }

    this.setState(prevState=>({
      clickedBook: {title: bookObj.title, description: bookObj.description, img_url: bookObj.img_url, users: bookObj.users},
      clickedBookId: bookObj.id,
      bookLiked: liked()
    }))
  }

  renderBookList = () =>{
    return this.state.bookApi.map((book, index) => <Menu.Item key={index} as={"a"} onClick={()=> this.clickHandler(book)}>
    {book.title}
  </Menu.Item>)
  }

  renderUsers = () =>{
    return this.state.clickedBook.users.map((user, index) => <List.Item key={index} icon="user" content={user.username} />)
  }

  likeOnClickHandler = () =>{

    if (this.state.bookLiked){
      
      const bookLikers = [...this.state.clickedBook.users]
      const userIndex = bookLikers.findIndex(user => JSON.stringify(user) === JSON.stringify({id: 1, username: 'pouros'}))

      bookLikers.splice(userIndex, 1)
      
      const newBookLikers = {...this.state.clickedBook, users: bookLikers}
  
      const bookObjConfig = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newBookLikers)
      }
  
      fetch(`http://localhost:3000/books/${this.state.clickedBookId}`, bookObjConfig)
      .then(r => r.json())
      .then(updatedBook => {
        let copiedApi = [...this.state.bookApi]
        let bookIndex = copiedApi.findIndex(book => book.id === updatedBook.id)
        copiedApi[bookIndex] = updatedBook
        this.setState(prevState=>({
          bookApi: copiedApi,
          clickedBook: newBookLikers,
          bookLiked: false
        }))
      })
      .catch(console.log)


    } else {

      const bookLikers = [...this.state.clickedBook.users, {id: 1, username: 'pouros'}]
      const newBookLikers = {...this.state.clickedBook, users: bookLikers}
  
      const bookObjConfig = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newBookLikers)
      }
  
      fetch(`http://localhost:3000/books/${this.state.clickedBookId}`, bookObjConfig)
      .then(r => r.json())
      .then(updatedBook => {
        let copiedApi = [...this.state.bookApi]
        let bookIndex = copiedApi.findIndex(book => book.id === updatedBook.id)
        copiedApi[bookIndex] = updatedBook
        this.setState(prevState=>({
          bookApi: copiedApi,
          clickedBook: newBookLikers,
          bookLiked: true
        }))
      })
      .catch(console.log)

    }

  }

  render(){
    // console.log(this.state.bookApi)
    // console.log("clicked book:", this.state.clickedBook)
    // console.log(this.state)
    return (
      <div>
        <Menu inverted>
          <Menu.Item header>Bookliker</Menu.Item>
        </Menu>
        <main>
          { this.state.bookApi.length === 0 ? <p>Books Loading...</p> :
          <Menu vertical inverted>
            {/* <Menu.Item as={"a"} onClick={e => console.log("book clicked!")}>
              Book title
            </Menu.Item> */}
            {this.renderBookList()}
          </Menu> }

          {Object.keys(this.state.clickedBook).length === 0 ? null :
          <Container text>
            <Header>{this.state.clickedBook.title}</Header>
            <Image
              src={this.state.clickedBook.img_url}
              size="small"
            />
            <p>{this.state.clickedBook.description}</p>
            <Button onClick={this.likeOnClickHandler}
              color="red"
              content={this.state.bookLiked ? "Unlike" : "Like"}
              icon={this.state.bookLiked ? "heart" : "heart outline"}
              label={{
                basic: true,
                color: "red",
                pointing: "left",
                content: this.state.clickedBook.users.length
              }}
            />
            <Header>Liked by</Header>
            <List>
              {/* <List.Item icon="user" content="User name" /> */}
              {this.renderUsers()}
            </List>
          </Container>}

        </main>
      </div>
    );
  }
}

export default App;
