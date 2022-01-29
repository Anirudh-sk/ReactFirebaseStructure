import firebase from "firebase/app";
import { v1 as uuid } from "uuid";

import { errCallback } from ".";
import { config, db, storage } from "../firebase";

const collection = db.collection("Chapters");
/* 
success([
        {
            name,
            units,
            id
        }
    ])
*/
export function listChapters() {
  return new Promise((success, failure) =>
    // success([
    //   {
    //     name: "D and Number Theory",
    //     id: "cd092uhreiucf83eid",
    //     published: true,
    //     topics: [
    //       { name: "11Hello", id: "coacd10", position: 0 },
    //       {
    //         name: "12Hello",
    //         id: "coacd12",
    //         position: 2,
    //       },
    //       {
    //         name: "13Hello",
    //         id: "coacd13",
    //         posichapterIdtion: 1,
    //       },
    //       { name: "14Hello", id: "coacd14", position: 3 },
    //     ],
    //   },
    //   // {
    //   //   name: "B Theory",
    //   //   id: "cd092eid3",
    //   //   published: true,
    //   //   topics: [{ name: "2xein", id: "coacdfre" }],
    //   // },
    //   // {
    //   //   name: "C Theory",
    //   //   id: "cei92ei3d",
    //   //   published: false,
    //   //   topics: [],
    //   // },
    // ]);
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

const topicsCollection = db.collection("Topics");

export function createTopic(topicName, position, chapterId) {
  return new Promise((success, failure) => {
    console.log("createTopic", topicName);

    const queue = db.batch();
    const id = uuid();
    queue.set(topicsCollection.doc(id), { nodes: [] }, { merge: true });
    queue.set(
      collection.doc(chapterId),
      {
        topics: firebase.firestore.FieldValue.arrayUnion({
          id,
          name: topicName,
          position,
        }),
      },
      { merge: true }
    );

    queue
      .commit()
      .then(() => success(id))
      .catch(errCallback(failure));
  });
}

export function renameTopic(topicName, topicData, chapterId) {
  return new Promise((success, failure) => {
    console.log("renameTopic", topicData);
    if (!topicData) {
      errCallback(failure);
      return;
    }

    const queue = db.batch();
    queue.set(
      collection.doc(chapterId),
      {
        topics: firebase.firestore.FieldValue.arrayRemove(topicData),
      },
      { merge: true }
    );
    queue.set(
      collection.doc(chapterId),
      {
        topics: firebase.firestore.FieldValue.arrayUnion({
          ...topicData,
          name: topicName,
        }),
      },
      { merge: true }
    );

    return queue.commit().then(success).catch(errCallback(failure));
  });
}

export function createChapter(data) {
  return new Promise((success, failure) => {
    console.log("createChapter", data);

    const docRef = collection.doc();

    const id = docRef.id;

    docRef
      .set(
        {
          name: data,
          id: id,
          topics: [],
          published: false,
        },
        { merge: true }
      )
      .then(() => success(id))
      .catch(errCallback(failure));
  });
}

export const MAX_TYPE = 3;
export const TOPIC_TYPE = {
  CONTENT: 0,
  IMAGE: 1,
  VIDEO: 2,
  URL: 3,
};

export function loadTopicNodes(topicId) {
  return new Promise((success, failure) => {
    console.log("loadTopicNodes", topicId);
    return topicsCollection
      .doc(topicId)
      .get()
      .then((docSnapshot) => success(docSnapshot.data().nodes || []))
      .catch(errCallback(failure));
  });
}

function topicNodeOperation(topicId, node, operationKey) {
  return new Promise((success, failure) => {
    if (node && node.value && node.type <= MAX_TYPE) {
      return topicsCollection
        .doc(topicId)
        .set(
          {
            nodes: firebase.firestore.FieldValue[operationKey](node),
          },
          { merge: true }
        )
        .then(success)
        .catch(errCallback(failure));
    } else {
      errCallback(failure);
    }
  });
}

export function addNode(topicId, node) {
  console.log("addNode", topicId);
  return topicNodeOperation(topicId, node, "arrayUnion");
}

export function deleteNode(topicId, node) {
  console.log("deleteNode", topicId);
  return topicNodeOperation(topicId, node, "arrayRemove");
}

/* 
data = {
    name: "summa",
    units: ["cjnjcn", "cjkfnc"],
    id: "c-summa-oru-id"
}

success()
*/
export function updateChapter(data) {
  return new Promise((success, failure) => {
    console.log("updateChapter", data);
    return collection
      .doc(data.id)
      .set(data, { merge: true })
      .then(success)
      .catch(errCallback(failure));
  });
}

export function updateTopic(topicId, nodes) {
  return new Promise((success, failure) => {
    if (!topicId) {
      return errCallback(failure);
    }
    return topicsCollection
      .doc(topicId)
      .set({ nodes }, { merge: true })
      .then(success)
      .catch(errCallback(failure));
  });
}

export const verifyVideo = (videoId) => {
  return fetch(
    `https://www.youtube.com/oembed?url=http%3A//youtube.com/watch%3Fv%3D${videoId}&format=json`
  );
};

export const uploadImage = (file, topicId, onUpload) => {
  return new Promise((success, failure) => {
    if (!file) {
      return errCallback(failure);
    }
    const fileName = `${Date.now()}.${file.type.split("/").pop()}`;
    return storage
      .ref(`topics/${topicId}/${fileName}`)
      .put(file)
      .on(
        "state_changed",
        (snapshot) => onUpload(snapshot.bytesTransferred / snapshot.totalBytes),
        errCallback(failure),
        () => success(fileName)
      );
  });
};

export const deleteImage = (file, topicId) => {
  return new Promise((success, failure) => {
    if (!file) {
      return errCallback(failure);
    }
    return storage
      .ref(`topics/${topicId}/${file}`)
      .delete()
      .then(success)
      .catch(errCallback(failure));
  });
};

export const getImageUrl = (topicId, file) => {
  return `https://firebasestorage.googleapis.com/v0/b/${
    config.storageBucket
  }/o/topics%2F${encodeURIComponent(topicId)}%2F${encodeURIComponent(
    file
  )}?alt=media`;
};
