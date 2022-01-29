import { errCallback } from ".";
import { db } from "../firebase";

const collection = db.collection("Semester");
/* 
success([
        {
            name,
            units,
            id
        }
    ])
*/
export function listSemesters() {
  return new Promise((success, failure) =>
    collection
      .get()
      .then((querySnapshot) => success(querySnapshot.docs.map((d) => d.data())))
      .catch(errCallback(failure))
  );
}

/* 
data = name

success(id)
*/
export function createSemester(data) {
  return new Promise((success, failure) => {
    console.log("createSemester", data);

    const docRef = collection.doc();

    const id = docRef.id;

    docRef
      .set(
        {
          name: data,
          id: id,
          units: [],
        },
        { merge: true }
      )
      .then(() => success(id))
      .catch(errCallback(failure));
  });
}

/* 
data = {
    name: "summa",
    units: ["cjnjcn", "cjkfnc"],
    id: "c-summa-oru-id"
}

success()
*/
export function updateSemester(data) {
  return new Promise((success, failure) => {
    console.log("updateSemester", data);
    collection
      .doc(data.id)
      .set(data, { merge: true })
      .then(success)
      .catch(errCallback(failure));
  });
}
