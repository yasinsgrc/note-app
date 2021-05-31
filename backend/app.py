from flask import Flask
from flask import jsonify
from flask import request
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import safe_str_cmp
 
from flask_jwt_extended import create_access_token
from flask_jwt_extended import current_user
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

app = Flask(__name__)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "asdfgdshfrdhdsfhasdaesdf"  # Change this!
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'query_string']
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///database.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False



jwt = JWTManager(app)
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, nullable=False, unique=True)

    # In a real application make sure to properly hash and salt passwords
    def check_password(self, password):
        return safe_str_cmp(password, "password")

class Notes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), unique=False, nullable=False)
    note = db.Column(db.Text, unique=False, nullable=False)
    user_id=db.Column(db.Integer, nullable=False)
    
    
# Register a callback function that takes whatever object is passed in as the
# identity when creating JWTs and converts it to a JSON serializable format.
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id

# Register a callback function that loades a user from your database whenever
# a protected route is accessed. This should return any python object on a
# successful lookup, or None if the lookup failed for any reason (for example
# if the user has been deleted from the database).
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")

    user = User.query.filter_by(username=username).one_or_none()
    if not user or not user.check_password(password):
        return jsonify("Wrong username or password"), 401

    # Notice that we are passing in the actual sqlalchemy user object here
    access_token = create_access_token(identity=user)
    return jsonify(access_token=access_token)

@app.route("/note", methods=["GET"])
@jwt_required() 
def get_note():
    notes=Notes.query.filter_by(user_id=current_user.id).all()
    output=[]
    
    for note in notes:
        note_data={}
        note_data["id"]=note.id
        note_data["title"]=note.title
        note_data["note"]=note.note
        
        output.append(note_data)
        
    return jsonify({"notes": output})

@app.route("/note", methods=["POST"])
@jwt_required() 
def add_note():
    note_title=request.json.get("title")
    note_text=request.json.get("note")
    
    new_todo=Notes(title=note_title, note=note_text, user_id=current_user.id) 
    db.session.add(new_todo)
    db.session.commit()
    
    note=Notes.query.filter_by(title=note_title, note=note_text).first()
    new_note={}
    new_note["id"]=note.id
    new_note["title"]=note.title
    new_note["note"]=note.note
    
    return jsonify({'note':new_note})

@app.route("/note/<note_id>", methods=["DELETE"])
@jwt_required() 
def delete_note(note_id):
    note=Notes.query.filter_by(id=note_id, user_id=current_user.id).first()
    
    if not note:
        return jsonify({"message":"Note not found"})
    
    db.session.delete(note)
    db.session.commit()
    
    return jsonify({"messages":"Note deleted"})
    
    return " "

 


if __name__ == "__main__":
    db.create_all()
    
    app.debug = True
    app.run() 