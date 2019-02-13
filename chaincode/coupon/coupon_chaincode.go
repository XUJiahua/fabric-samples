/*
 SPDX-License-Identifier: Apache-2.0
*/

// ====CHAINCODE EXECUTION SAMPLES (CLI) ==================

// assumption
// channel: myc
// chaincode id: mycc

// terminal 1
// cd chaincode-docker-devmode && docker-compose -f docker-compose-simple.yaml up

// terminal 2
// docker exec -it chaincode bash
// cd coupon && go build
// CORE_PEER_ADDRESS=peer:7052 CORE_CHAINCODE_ID_NAME=mycc:0 ./coupon

// terminal 3
// docker exec -it cli bash
// peer chaincode install -p chaincodedev/chaincode/coupon -n mycc -v 0
// peer chaincode instantiate -n mycc -v 0 -c '{"Args":[]}' -C myc

// ==== Invoke coupons ====
// peer chaincode invoke -C myc -n mycc -c '{"Args":["initCoupon","0001","john","gloud $300","for john"]}'
// peer chaincode invoke -C myc -n mycc -c '{"Args":["initCoupon","0002","tom","free lunch","for tom"]}'
// peer chaincode invoke -C myc -n mycc -c '{"Args":["initCoupon","0003","jack","free dinner","for jack"]}'
// peer chaincode invoke -C myc -n mycc -c '{"Args":["transferCoupon","0002","jerry"]}'
// peer chaincode invoke -C myc -n mycc -c '{"Args":["transferCouponsBasedOnOwner","john","jerry"]}'
// peer chaincode invoke -C myc -n mycc -c '{"Args":["delete","0003"]}'

// ==== Query coupons ====
// peer chaincode query -C myc -n mycc -c '{"Args":["readCoupon","0001"]}'
// peer chaincode query -C myc -n mycc -c '{"Args":["getCouponsByRange","0001","0004"]}'
// peer chaincode query -C myc -n mycc -c '{"Args":["getCouponsOfOwner","jerry"]}'
// peer chaincode query -C myc -n mycc -c '{"Args":["getHistoryForCoupon","0001"]}'
//

// ===== reference =====
// https://hyperledger-fabric.readthedocs.io/en/latest/chaincode4ade.html

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

const (
	compositeKeyIndexName = "owner~code"
)

// CouponChaincode example simple Chaincode implementation
type CouponChaincode struct {
}

type coupon struct {
	Code  string `json:"code"`  // unique id for coupon
	Owner string `json:"owner"` // coupon owner
	Name  string `json:"name"`  // coupon name
	Note  string `json:"note"`  // note for coupon
}

// ===================================================================================
// Main
// ===================================================================================
func main() {
	err := shim.Start(new(CouponChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

// Init initializes chaincode
// ===========================
func (t *CouponChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

// Invoke - Our entry point for Invocations
// ========================================
func (t *CouponChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "initCoupon" { //create a new coupon
		return t.initCoupon(stub, args)
	} else if function == "transferCoupon" { //change owner of a specific coupon
		return t.transferCoupon(stub, args)
	} else if function == "transferCouponsBasedOnOwner" { //transfer all coupons of a certain color
		return t.transferCouponsBasedOnOwner(stub, args)
	} else if function == "delete" { //delete a coupon
		return t.delete(stub, args)
	} else if function == "readCoupon" { //read a coupon
		return t.readCoupon(stub, args)
	} else if function == "getHistoryForCoupon" { //get history of values for a coupon
		return t.getHistoryForCoupon(stub, args)
	} else if function == "getCouponsByRange" { //get coupons based on range query
		return t.getCouponsByRange(stub, args)
	} else if function == "getCouponsOfOwner" { //get all coupons of a user
		return t.getCouponsOfOwner(stub, args)
	}

	fmt.Println("invoke did not find func: " + function) //error
	return shim.Error("Received unknown function invocation")
}

// ============================================================
// initCoupon - create a new coupon, store into chaincode state
// ============================================================
func (t *CouponChaincode) initCoupon(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error

	//   0       1       2     3
	// "6752629368", "john", "gcloud $300", "for john"
	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	// ==== Input sanitation ====
	fmt.Println("- start init coupon")
	if len(args[0]) <= 0 {
		return shim.Error("1st argument must be a non-empty string")
	}
	if len(args[1]) <= 0 {
		return shim.Error("2nd argument must be a non-empty string")
	}
	if len(args[2]) <= 0 {
		return shim.Error("3rd argument must be a non-empty string")
	}
	if len(args[3]) <= 0 {
		return shim.Error("4th argument must be a non-empty string")
	}
	code := strings.ToLower(args[0])
	owner := strings.ToLower(args[1])
	name := strings.ToLower(args[2])
	note := strings.ToLower(args[3])

	// ==== Check if coupon already exists ====
	couponAsBytes, err := stub.GetState(code)
	if err != nil {
		return shim.Error("Failed to get coupon: " + err.Error())
	} else if couponAsBytes != nil {
		fmt.Println("This coupon already exists: " + code)
		return shim.Error("This coupon already exists: " + code)
	}

	// ==== Create coupon object and marshal to JSON ====
	coupon := &coupon{code, owner, name, note}
	couponJSONasBytes, err := json.Marshal(coupon)
	if err != nil {
		return shim.Error(err.Error())
	}

	// === Save coupon to state ===
	err = stub.PutState(code, couponJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	//  ==== Index the coupon to enable owner-based range queries, e.g. return all john's coupons ====
	//  An 'index' is a normal key/value entry in state.
	//  The key is a composite key, with the elements that you want to range query on listed first.
	//  In our case, the composite key is based on indexName~owner~name.
	//  This will enable very efficient state range queries based on composite keys matching indexName~owner~*
	ownerCodeIndexKey, err := stub.CreateCompositeKey(compositeKeyIndexName, []string{coupon.Owner, coupon.Code})
	if err != nil {
		return shim.Error(err.Error())
	}
	//  Save index entry to state. Only the key name is needed, no need to store a duplicate copy of the coupon.
	//  Note - passing a 'nil' value will effectively delete the key from state, therefore we pass null character as value
	value := []byte{0x00}
	err = stub.PutState(ownerCodeIndexKey, value)
	if err != nil {
		return shim.Error("Failed to put state:" + err.Error())
	}

	// ==== Coupon saved and indexed. Return success ====
	fmt.Println("- end init coupon")
	return shim.Success(nil)
}

// ===============================================
// readCoupon - read a coupon from chaincode state
// ===============================================
func (t *CouponChaincode) readCoupon(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var code, jsonResp string
	var err error

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting code of the coupon to query")
	}

	code = args[0]
	valAsbytes, err := stub.GetState(code) //get the coupon from chaincode state
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + code + "\"}"
		return shim.Error(jsonResp)
	} else if valAsbytes == nil {
		jsonResp = "{\"Error\":\"coupon does not exist: " + code + "\"}"
		return shim.Error(jsonResp)
	}

	return shim.Success(valAsbytes)
}

// ==================================================
// delete - remove a coupon key/value pair from state
// ==================================================
func (t *CouponChaincode) delete(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var jsonResp string
	var couponJSON coupon
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	code := args[0]

	// to maintain the owner~code index, we need to read the coupon first and get its color
	valAsbytes, err := stub.GetState(code) //get the coupon from chaincode state
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + code + "\"}"
		return shim.Error(jsonResp)
	} else if valAsbytes == nil {
		jsonResp = "{\"Error\":\"Coupon does not exist: " + code + "\"}"
		return shim.Error(jsonResp)
	}

	err = json.Unmarshal([]byte(valAsbytes), &couponJSON)
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to decode JSON of: " + code + "\"}"
		return shim.Error(jsonResp)
	}

	err = stub.DelState(code) //remove the coupon from chaincode state
	if err != nil {
		return shim.Error("Failed to delete state:" + err.Error())
	}

	// maintain the index
	ownerCodeIndexKey, err := stub.CreateCompositeKey(compositeKeyIndexName, []string{couponJSON.Owner, couponJSON.Code})
	if err != nil {
		return shim.Error(err.Error())
	}

	//  Delete index entry to state.
	err = stub.DelState(ownerCodeIndexKey)
	if err != nil {
		return shim.Error("Failed to delete state:" + err.Error())
	}
	return shim.Success(nil)
}

// ===========================================================
// transfer a coupon by setting a new owner name on the coupon
// ===========================================================
func (t *CouponChaincode) transferCoupon(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	//   0       1
	// "name", "bob"
	if len(args) < 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	code := strings.ToLower(args[0])
	newOwner := strings.ToLower(args[1])
	fmt.Println("- start transferCoupon ", code, newOwner)

	couponAsBytes, err := stub.GetState(code)
	if err != nil {
		return shim.Error("Failed to get coupon:" + err.Error())
	} else if couponAsBytes == nil {
		return shim.Error("Coupon does not exist")
	}

	couponToTransfer := coupon{}
	err = json.Unmarshal(couponAsBytes, &couponToTransfer) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	oldOwner := couponToTransfer.Owner
	couponToTransfer.Owner = newOwner //change the owner

	couponJSONasBytes, _ := json.Marshal(couponToTransfer)
	err = stub.PutState(code, couponJSONasBytes) //rewrite the coupon
	if err != nil {
		return shim.Error(err.Error())
	}

	// maintain the composite index
	ownerCodeIndexKey, err := stub.CreateCompositeKey(compositeKeyIndexName, []string{oldOwner, code})
	if err != nil {
		return shim.Error(err.Error())
	}

	//  Delete index entry to state.
	err = stub.DelState(ownerCodeIndexKey)
	if err != nil {
		return shim.Error("Failed to delete state:" + err.Error())
	}

	// Add new composite index entry
	ownerCodeIndexKey, err = stub.CreateCompositeKey(compositeKeyIndexName, []string{newOwner, code})
	if err != nil {
		return shim.Error(err.Error())
	}
	value := []byte{0x00}
	err = stub.PutState(ownerCodeIndexKey, value)
	if err != nil {
		return shim.Error("Failed to put state:" + err.Error())
	}

	fmt.Println("- end transferCoupon (success)")
	return shim.Success(nil)
}

// ===========================================================================================
// constructQueryResponseFromIterator constructs a JSON array containing query results from
// a given result iterator
// ===========================================================================================
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) (*bytes.Buffer, error) {
	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return &buffer, nil
}

// ===========================================================================================
// getCouponsByRange performs a range query based on the start and end keys provided.

// Read-only function results are not typically submitted to ordering. If the read-only
// results are submitted to ordering, or if the query is used in an update transaction
// and submitted to ordering, then the committing peers will re-execute to guarantee that
// result sets are stable between endorsement time and commit time. The transaction is
// invalidated by the committing peers if the result set has changed between endorsement
// time and commit time.
// Therefore, range queries are a safe option for performing update transactions based on query results.
// ===========================================================================================
func (t *CouponChaincode) getCouponsByRange(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) < 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	startKey := args[0]
	endKey := args[1]

	resultsIterator, err := stub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	buffer, err := constructQueryResponseFromIterator(resultsIterator)
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Printf("- getCouponsByRange queryResult:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

// ==== Example: GetStateByPartialCompositeKey/RangeQuery =========================================
// transferCouponsBasedOnOwner will transfer coupons of a user to a certain new owner.
// Uses a GetStateByPartialCompositeKey (range query) against color~name 'index'.
// Committing peers will re-execute range queries to guarantee that result sets are stable
// between endorsement time and commit time. The transaction is invalidated by the
// committing peers if the result set has changed between endorsement time and commit time.
// Therefore, range queries are a safe option for performing update transactions based on query results.
// ===========================================================================================
func (t *CouponChaincode) transferCouponsBasedOnOwner(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	//   0       1
	// "owner", "bob"
	if len(args) < 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	owner := args[0]
	newOwner := strings.ToLower(args[1])
	fmt.Println("- start transferCouponsBasedOnOwner ", owner, newOwner)

	// Query the owner~name index by owner
	// This will execute a key range query on all keys starting with 'owner'
	usersCouponResultsIterator, err := stub.GetStateByPartialCompositeKey(compositeKeyIndexName, []string{owner})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer usersCouponResultsIterator.Close()

	// Iterate through result set and for each coupon found, transfer to newOwner
	var i int
	for i = 0; usersCouponResultsIterator.HasNext(); i++ {
		// Note that we don't get the value (2nd return variable), we'll just get the coupon name from the composite key
		responseRange, err := usersCouponResultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		// get the owner and name from owner~name composite key
		objectType, compositeKeyParts, err := stub.SplitCompositeKey(responseRange.Key)
		if err != nil {
			return shim.Error(err.Error())
		}
		returnedOwner := compositeKeyParts[0]
		returnedCode := compositeKeyParts[1]
		fmt.Printf("- found a coupon from index:%s owner:%s name:%s\n", objectType, returnedOwner, returnedCode)

		// Now call the transfer function for the found coupon.
		// Re-use the same function that is used to transfer individual coupons
		response := t.transferCoupon(stub, []string{returnedCode, newOwner})
		// if the transfer failed break out of loop and return error
		if response.Status != shim.OK {
			return shim.Error("Transfer failed: " + response.Message)
		}
	}

	responsePayload := fmt.Sprintf("Transferred %d %s coupons to %s", i, owner, newOwner)
	fmt.Println("- end transferCouponsBasedOnOwner: " + responsePayload)
	return shim.Success([]byte(responsePayload))
}

// ==== Example: GetStateByPartialCompositeKey/RangeQuery =========================================
// getCouponsOfOwner will get coupons of a user.
// Uses a GetStateByPartialCompositeKey (range query) against color~name 'index'.
// Committing peers will re-execute range queries to guarantee that result sets are stable
// between endorsement time and commit time. The transaction is invalidated by the
// committing peers if the result set has changed between endorsement time and commit time.
// Therefore, range queries are a safe option for performing update transactions based on query results.
// ===========================================================================================
func (t *CouponChaincode) getCouponsOfOwner(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	//   0
	// "john"
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	owner := args[0]
	fmt.Println("- start getCouponsOfOwner ", owner)

	// Query the owner~name index by owner
	// This will execute a key range query on all keys starting with 'owner'
	usersCouponResultsIterator, err := stub.GetStateByPartialCompositeKey(compositeKeyIndexName, []string{owner})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer usersCouponResultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false

	// Iterate through result set and for each coupon found, transfer to newOwner
	for usersCouponResultsIterator.HasNext() {
		// Note that we don't get the value (2nd return variable), we'll just get the coupon name from the composite key
		responseRange, err := usersCouponResultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		// get the owner and name from owner~code composite key
		objectType, compositeKeyParts, err := stub.SplitCompositeKey(responseRange.Key)
		if err != nil {
			return shim.Error(err.Error())
		}
		returnedOwner := compositeKeyParts[0]
		returnedCode := compositeKeyParts[1]

		fmt.Printf("- found a coupon from index:%s owner:%s name:%s\n", objectType, returnedOwner, returnedCode)

		valAsbytes, err := stub.GetState(returnedCode) //get the coupon from chaincode state
		var jsonResp string
		if err != nil {
			jsonResp = "{\"Error\":\"Failed to get state for " + returnedCode + "\"}"
			return shim.Error(jsonResp)
		} else if valAsbytes == nil {
			jsonResp = "{\"Error\":\"coupon does not exist: " + returnedCode + "\"}"
			return shim.Error(jsonResp)
		}

		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(returnedCode)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(valAsbytes))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getCouponsOfOwner queryResult:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (t *CouponChaincode) getHistoryForCoupon(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	code := args[0]

	fmt.Printf("- start getHistoryForCoupon: %s\n", code)

	resultsIterator, err := stub.GetHistoryForKey(code)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing historic values for the coupon
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")
		// if it was a delete operation on given key, then we need to set the
		//corresponding value null. Else, we will write the response.Value
		//as-is (as the Value itself a JSON coupon)
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getHistoryForCoupon returning:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}
