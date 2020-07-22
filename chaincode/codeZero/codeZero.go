package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type Codezero struct {
}

type details struct {
	ObjectType   string `json:"docType"`
	DocHas       string `json:"docHas"`
	Name         string `json:"name"`
	Type         string `json:"type"`
	Size         string `json:"size"`
	Permissions  string `json:"permissions"`
	LastModified string `json:"lastModified"`
}

func main() {
	err := shim.Start(new(Codezero))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

func (t *Codezero) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

func (t *Codezero) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("invoke is running " + function)
	if function == "invokeDetails" {
		return t.invokeDetails(stub, args)
	} else if function == "readDetails" {
		return t.readDetails(stub, args)
	}
	fmt.Println("invoke did not find func: " + function)
	return shim.Error("Received unknown function invocation")
}

func (t *Codezero) invokeDetails(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("- start init document details insertion")

	DocHas := args[0]
	Name := args[1]
	Type := args[2]
	Size := args[3]
	Permissions := args[4]
	LastModified := args[5]
	objectType := "codeZero"

	DocDetails := &details{objectType, DocHas, Name, Type, Size, Permissions, LastModified}
	DocDetailsJSONasBytes, err := json.Marshal(DocDetails)

	if err != nil {
		return shim.Error(err.Error())
	}
	fmt.Println("After marshal details are ", DocDetailsJSONasBytes)

	err = stub.PutState(Name, DocDetailsJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end ")
	return shim.Success(nil)

}

func (t *Codezero) readDetails(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var name, jsonResp string
	var err error

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting name of the document to query")
	}

	name = args[0]
	valAsbytes, err := stub.GetState(name)
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + name + "\"}"
		return shim.Error(jsonResp)
	} else if valAsbytes == nil {
		jsonResp = "{\"Error\":\"Document does not exist: " + name + "\"}"
		return shim.Error(jsonResp)
	}

	return shim.Success(valAsbytes)
}
