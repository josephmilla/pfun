/**
* Name: B+ Tree JavaScript
* Authors: Joseph Milla
* Version: 0.0.0;
* Comment: Oh yeah...
*/

// Default order is 3.
var DEFAULT_ORDER = 3;

// TYPES.

function record(data) {
  this.value = data;
}

function node(order) {
  this.pointers = new Array(order);
  this.keys = new Array(order - 1);
  this.parent = null;
  this.is_leaf = false;
  this.num_keys = 0;
  this.next = null; // Used for queue.
  this.nodeID = 0; // Used for graphical tree
} 

node.prototype = {
	equals: function (node2) {
		if (this.num_keys != node2.num_keys) return false;
		for (var i = 0; i < this.num_keys; i++)
			if (this.keys[i] != node2.keys[i])
				return false;
		return true;
	}
}

function BPLusTree() {
    this.order = DEFAULT_ORDER;
//	this.bubbooID = 0;
    this.queue = null;
}

BPLusTree.prototype = {

    //restore constructor
    constructor: BPLusTree,

	enqueue: function (new_node) {
		var c = null;
		if (this.queue === null) {
			this.queue = new_node;
			this.queue.next = null;
		}
		else {
			c = this.queue;
			while(c.next) {
			  c = c.next;
			}
			c.next = new_node;
			new_node.next = null;
		}	
	},

	dequeue: function( ) {
		var n = this.queue;
		this.queue = this.queue.next;
		n.next = null;
		return n;
	},
	
	print_leaves: function( root ) {
		var i;
		var leafStr = "", leafValStr = "";
		var c = root;
		if (root === null) {
			document.getElementById("output").innerHTML =  "Empty tree.<br>";
			return;
		}
		while (!c.is_leaf)
			c = c.pointers[0];
		while (true) {
			for (i = 0; i < c.num_keys; i++) {
				leafStr +=  "<input type=text size=5 style='text-align:center' value='" + c.keys[i] + "' onfocus='javascript:this.blur()'/>";
				leafValStr +=  "<input type=text size=5 style='text-align:center' value='" + c.pointers[i].value + "' onfocus='javascript:this.blur()'/>"; 
			}
			if (c.pointers[this.order - 1]) {
				leafStr +=  "&nbsp;&nbsp;_&nbsp;&nbsp;";
				leafValStr +=  "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
				c = c.pointers[this.order - 1];
			}
			else
				break;
		}
		document.getElementById("output").innerHTML =  leafStr+ "<br>" + leafValStr;
	},	

	path_to_root: function( root, child ) {
		var length = 0;
		var c = child;
		while (c != root) {
			c = c.parent;
			length++;
		}
		return length;
	},

	print_tree: function( root ) {
		var n = null;
		var i = 0;
		var j = 0;
		var rank = 0;
		var new_rank = 0;
		var innerStr = "", OneLevelStr = "", branchesStr = "", leafStr = "", leafValStr = "", keyCtr = 0, nodeCtr = 0;
		//var myTree = new ECOTree("myTree","myTreeContainer");
		
		if (root === null) {
			document.getElementById("output").innerHTML =  "Empty tree.<br>";
			return;
		}
		this.queue = null;
		this.enqueue(root);
		while( this.queue ) {
			n = this.dequeue();
			if (n.parent && n.equals(n.parent.pointers[0])) {//alert("look: " + n.keys[0] +","+ n.equals(n.parent.pointers[0]));
				new_rank = this.path_to_root( root, n );
				if (new_rank != rank) {
					rank = new_rank; 
					OneLevelStr = OneLevelStr.substring(0, OneLevelStr.length - 1);
					var spacer = ""; //alert(nodeCtr + "," + keyCtr);
					for (sp = 0; sp < (nodeCtr - 1) + (keyCtr - 1); sp++)
						spacer += "&nbsp;&nbsp;&nbsp;&nbsp;";
					OneLevelStr = OneLevelStr.replace(/#/g, spacer);
					lastIndex = branchesStr.lastIndexOf('#'); 
					if (lastIndex >= 0) branchesStr = branchesStr.substring(0, lastIndex) + branchesStr.substring(lastIndex + 1, branchesStr.length); 
					branchesStr = branchesStr.replace(/#/g, spacer);
					innerStr +=  OneLevelStr + "<br>" + branchesStr + "<br>";
					branchesStr = ""; OneLevelStr = ""; keyCtr = 0; nodeCtr = 0;					
				}
			}
			if (!n.is_leaf) {
				for (j = 0; j <= n.num_keys; j++)
					this.enqueue(n.pointers[j]);
				keyCtr += n.num_keys + 1;
				nodeCtr++;
			}
			for (i = 0; i < n.num_keys; i++) {
				if (i == 0) branchesStr += "/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\#";
				else branchesStr += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\";
				if (!n.is_leaf) {
					OneLevelStr +=  "<input type=text size=5 style='text-align:center' value='" + n.keys[i] + "' onfocus='javascript:this.blur()'/>";
					//var parentID = n.parent ? n.parent.nodeID : -1;
					//myTree.add(n.nodeID,parentID,n.keys[i]);
				}
				else {// display record of leaf
					leafStr +=  "<input type=text size=5 style='text-align:center' value='" + n.keys[i] + "' onfocus='javascript:this.blur()'/>";
					leafValStr +=  "<input type=text size=5 style='text-align:center' value='" + n.pointers[i].value + "' onfocus='javascript:this.blur()'/>"; 
					//var parentID = n.parent ? n.parent.nodeID : -1; alert(n.nodeID);
					//myTree.add(n.nodeID,parentID,n.keys[i] + ": " + n.pointers[i].value);
					keyCtr++;
					if (i == n.num_keys - 1) {
						leafStr +=  "&nbsp;&nbsp;_&nbsp;&nbsp;";
						leafValStr +=  "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					}
				}
			} // for loop for one node
			OneLevelStr += "#";
		} // outer while for queue
		leafStr = leafStr.substring(0, leafStr.length - 25);
		leafValStr = leafValStr.substring(0, leafValStr.length - 36); 
		document.getElementById("output").innerHTML =  innerStr + "<br>" + leafStr+ "<br>" + leafValStr;
	//	myTree.UpdateTree();
	},

	find_leaf: function( root, key ) {
		var i = 0;
		var c = root;
		if (c === null) {
			return c;
		}
		while (!c.is_leaf) {
			i = 0;
			while (i < c.num_keys) {
				if (key >= c.keys[i]) i++;
				else break;
			}
			c = c.pointers[i];
		}
		return c;
	},
	
	find: function( root, key ) {
		var i = 0;
		c = this.find_leaf( root, key );
		if (c === null) return null;
		for (i = 0; i < c.num_keys; i++)
			if (c.keys[i] == key) break;
		if (i == c.num_keys) 
			return null;
		else
			return c.pointers[i];
	},	
	
	findRange: function(root, min, max) {
		var strResult="";
		var i = 0;
		c = this.find_leaf( root, min );
		if (c === null) return null;
		while ( c )
		{
			for (i = 0; i < c.num_keys; i++) {
				if (c.keys[i] >= min)
					if (c.keys[i] <= max) {
						strResult += c.keys[i] + "=>" + c.pointers[i].value + ", ";
					}
					else { c = null; break; }
			}
			if (c) c = c.pointers[ this.order - 1 ];
		}
		if (strResult == "") return null;
		return strResult.substring(0, strResult.length - 2);;
	},
	
	cut: function( length ) {
		if (length % 2 == 0)
			return parseInt(length/2);
		else
			return parseInt(length/2) + 1;
	},
	
	toArray: function(){
        var result = [],
            current = this.queue;
        
        while(current){
            result.push(current.num_keys);
            current = current.next;
        }
        
        return result;
    },	
	
	toString: function(){
        return this.toArray().toString();
	},
	
// INSERTION

	make_record: function(value) {
		var new_record = new record(value);
		if (new_record === null) {
			alert("Record creation error.");
			return null;
		}
		return new_record;
	},

	make_node: function(  ) {
		var new_node = new node(this.order);
		if (new_node === null) {
			alert("Node creation error.");
			return null;
		}
	//	alert(this.bubbooID);
		//new_node.nodeID = this.uniqID;
		return new_node;
	},
	
	make_leaf: function( ) {
		var leaf = this.make_node();
		leaf.is_leaf = true;
		return leaf;
	},

	get_left_index: function( parent, left) {
		var left_index = 0;
		while (left_index <= parent.num_keys && 
			parent.pointers[left_index] != left)
			left_index++;
		return left_index;
	},	

	insert_into_leaf: function( leaf, key, pointer ) {
		var i, insertion_point = 0;
		while (insertion_point < leaf.num_keys && leaf.keys[insertion_point] < key)
			insertion_point++;
		for (i = leaf.num_keys; i > insertion_point; i--) {
			leaf.keys[i] = leaf.keys[i - 1];
			leaf.pointers[i] = leaf.pointers[i - 1];
		}
		leaf.keys[insertion_point] = key;
		leaf.pointers[insertion_point] = pointer;
		leaf.num_keys++;
		return leaf;
	},
	
	insert_into_leaf_after_splitting: function( root, leaf, key, pointer) {
		var new_leaf;
		var temp_keys;
		var temp_pointers;
		var insertion_index, split, new_key, i, j;

		new_leaf = this.make_leaf();

		temp_keys = new Array( this.order );
		temp_pointers = new Array( this.order );

		insertion_index = 0;
		while (leaf.keys[insertion_index] < key && insertion_index < this.order - 1)
			insertion_index++;

		for (i = 0, j = 0; i < leaf.num_keys; i++, j++) {
			if (j == insertion_index) j++;
			temp_keys[j] = leaf.keys[i];
			temp_pointers[j] = leaf.pointers[i];
		}

		temp_keys[insertion_index] = key;
		temp_pointers[insertion_index] = pointer;

		leaf.num_keys = 0;

		split = this.cut(this.order - 1);

		for (i = 0; i < split; i++) {
			leaf.pointers[i] = temp_pointers[i];
			leaf.keys[i] = temp_keys[i];
			leaf.num_keys++;
		}

		for (i = split, j = 0; i < this.order; i++, j++) {
			new_leaf.pointers[j] = temp_pointers[i];
			new_leaf.keys[j] = temp_keys[i];
			new_leaf.num_keys++;
		}

		new_leaf.pointers[this.order - 1] = leaf.pointers[this.order - 1];
		leaf.pointers[this.order - 1] = new_leaf;

		for (i = leaf.num_keys; i < this.order - 1; i++)
			leaf.pointers[i] = null;
		for (i = new_leaf.num_keys; i < this.order - 1; i++)
			new_leaf.pointers[i] = null;

		new_leaf.parent = leaf.parent;
		new_key = new_leaf.keys[0];

		return this.insert_into_parent(root, leaf, new_key, new_leaf);
	},

	insert_into_node: function( root, n, left_index, key, right) {
		var i;
		for (i = n.num_keys; i > left_index; i--) {
			n.pointers[i + 1] = n.pointers[i];
			n.keys[i] = n.keys[i - 1];
		}
		n.pointers[left_index + 1] = right;
		n.keys[left_index] = key;
		n.num_keys++;
		return root;
	},
	
	insert_into_node_after_splitting: function( root, old_node, left_index, key, right) {
		var i, j, split, k_prime;
		var new_node, child;
		var temp_keys;
		var temp_pointers;

		temp_pointers = new Array(this.order + 1);
		temp_keys = new Array( this.order );

		for (i = 0, j = 0; i < old_node.num_keys + 1; i++, j++) {
			if (j == left_index + 1) j++;
			temp_pointers[j] = old_node.pointers[i];
		}

		for (i = 0, j = 0; i < old_node.num_keys; i++, j++) {
			if (j == left_index) j++;
			temp_keys[j] = old_node.keys[i];
		}

		temp_pointers[left_index + 1] = right;
		temp_keys[left_index] = key;

		split = this.cut(this.order);
		new_node = this.make_node();

		old_node.num_keys = 0;
		for (i = 0; i < split - 1; i++) {
			old_node.pointers[i] = temp_pointers[i];
			old_node.keys[i] = temp_keys[i];
			old_node.num_keys++;
		}
		old_node.pointers[i] = temp_pointers[i];

		k_prime = temp_keys[split - 1];//alert("huy: "+ k_prime + "," + split);
		for (++i, j = 0; i < this.order; i++, j++) {
			new_node.pointers[j] = temp_pointers[i];
			new_node.keys[j] = temp_keys[i];
			new_node.num_keys++;
		}
		new_node.pointers[j] = temp_pointers[i];

		new_node.parent = old_node.parent;
		for (i = 0; i <= new_node.num_keys; i++) {
			child = new_node.pointers[i];
			child.parent = new_node;
		}

		return this.insert_into_parent(root, old_node, k_prime, new_node);
	},
	
	insert_into_parent: function( root, left, key, right) {
		var left_index;
		var parent = left.parent;

		/* Case: new root. */
		if (parent === null)
			return this.insert_into_new_root(left, key, right);

		/* Case: leaf or node. (Remainder of function body.) Find the parent's pointer to the left node. */
		left_index = this.get_left_index(parent, left);

		/* Simple case: the new key fits into the node. */
		if (parent.num_keys < this.order - 1)
			return this.insert_into_node(root, parent, left_index, key, right);

		/* Harder case:  split a node in order 
		* to preserve the B+ tree properties.
		*/

		return this.insert_into_node_after_splitting(root, parent, left_index, key, right);
	},
	
	insert_into_new_root: function( left, key, right) {
		var root = this.make_node();
		root.keys[0] = key;
		root.pointers[0] = left;
		root.pointers[1] = right;
		root.num_keys++;
		root.parent = null;
		left.parent = root;
		right.parent = root;
		return root;
	},
	
	start_new_tree: function( key, pointer) {
		var root = this.make_leaf();
		root.keys[0] = key;
		root.pointers[0] = pointer;
		root.pointers[this.order - 1] = null;
		root.parent = null;
		root.num_keys++;
		return root;
	},
	
	insert: function( root, key, value ) {
		var pointer;
		var leaf;

		/* The current implementation ignores duplicates.*/
		if (this.find(root, key))
		{ alert("Key already exists!");	return root; }

		/* Create a new record for the value.*/
		pointer = this.make_record(value);

		/* Case: the tree does not exist yet. Start a new tree.	*/
		if (root === null) 
			return this.start_new_tree(key, pointer);

		/* Case: the tree already exists. (Rest of function body.)	*/
		leaf = this.find_leaf(root, key);

		/* Case: leaf has room for key and pointer.	*/
		if (leaf.num_keys < this.order - 1) {
			leaf = this.insert_into_leaf(leaf, key, pointer);
			return root;
		}

		/* Case:  leaf must be split. */
		return this.insert_into_leaf_after_splitting(root, leaf, key, pointer);
	},
	

// DELETION.

	get_neighbor_index: function( n ) {
		var i;
		for (i = 0; i <= n.parent.num_keys; i++)
			if (n.parent.pointers[i].equals(n))
				return i - 1;

		// Error state.
		alert("Search for nonexistent pointer to node in parent.\n");
		alert("Node: "+ n.keys[0]);
	},

	remove_entry_from_node: function( n, key, pointer) {
		var i, num_pointers;
		// Remove the key and shift other keys accordingly.
		i = 0;
		while (n.keys[i] != key)
			i++;
		for (++i; i < n.num_keys; i++)
			n.keys[i - 1] = n.keys[i];

		// Remove the pointer and shift other pointers accordingly.
		// First determine number of pointers.
		num_pointers = n.is_leaf ? n.num_keys : n.num_keys + 1;
		i = 0;
		while (n.pointers[i] != pointer)
			i++;
		for (++i; i < num_pointers; i++)
			n.pointers[i - 1] = n.pointers[i];

		// One key fewer.
		n.num_keys--;

		// Set the other pointers to null for tidiness.
		// A leaf uses the last pointer to point to the next leaf.
		if (n.is_leaf)
			for (i = n.num_keys; i < this.order - 1; i++)
				n.pointers[i] = null;
		else
			for (i = n.num_keys + 1; i < this.order; i++)
				n.pointers[i] = null;

		return n;
	},
	
	adjust_root: function( root ) {
		var new_root;

		/* Case: nonempty root. Key and pointer have already been deleted, so nothing to be done. */

		if (root.num_keys > 0)
			return root;

		/* Case: empty root. */
		// If it has a child, promote the first (only) child as the new root.
		if (!root.is_leaf) {
			new_root = root.pointers[0];
			new_root.parent = null;
		}
		// If it is a leaf (has no children), then the whole tree is empty.
		else
			new_root = null;

		delete root.keys;
		delete root.pointers;
		delete root;			

		return new_root;
	},
	
	coalesce_nodes: function( root, n, neighbor, neighbor_index, k_prime) {
		var i, j, neighbor_insertion_index, n_start, n_end, new_k_prime;
		var tmp;
		var split; // bool

		/* Swap neighbor with node if node is on the extreme left and neighbor is to its right.	*/
		if (neighbor_index == -1) {
			tmp = n;
			n = neighbor;
			neighbor = tmp;
		}

		/* Starting point in the neighbor for copying keys and pointers from n.
		* Recall that n and neighbor have swapped places in the special case of n being a leftmost child. */
		neighbor_insertion_index = neighbor.num_keys;

		/* Nonleaf nodes may sometimes need to remain split, if the insertion of k_prime would cause the resulting
		* single coalesced node to exceed the limit order - 1. The variable split is always false for leaf nodes
		* and only sometimes set to true for nonleaf nodes.	*/
		split = false;

		/* Case:  nonleaf node. Append k_prime and the following pointer. If there is room in the neighbor, append
		* all pointers and keys from the neighbor. Otherwise, append only cut(order) - 2 keys and cut(order) - 1 pointers. */
		if (!n.is_leaf) {
			/* Append k_prime.	*/
			neighbor.keys[neighbor_insertion_index] = k_prime;
			neighbor.num_keys++;

			/* Case (default):  there is room for all of n's keys and pointers in the neighbor after appending k_prime.	*/
			n_end = n.num_keys;

			/* Case (special): k cannot fit with all the other keys and pointers into one coalesced node. */
			n_start = 0; // Only used in this special case.
			if (n.num_keys + neighbor.num_keys >= this.order) {
				split = true;
				n_end = this.cut(this.order) - 2;
			}

			for (i = neighbor_insertion_index + 1, j = 0; j < n_end; i++, j++) {
				neighbor.keys[i] = n.keys[j];
				neighbor.pointers[i] = n.pointers[j];
				neighbor.num_keys++;
				n.num_keys--;
				n_start++;
			}

			/* The number of pointers is always one more than the number of keys.	*/
			neighbor.pointers[i] = n.pointers[j];

			/* If the nodes are still split, remove the first key from n. */
			if (split) {
				new_k_prime = n.keys[n_start];
				for (i = 0, j = n_start + 1; i < n.num_keys; i++, j++) {
					n.keys[i] = n.keys[j];
					n.pointers[i] = n.pointers[j];
				}
				n.pointers[i] = n.pointers[j];
				n.num_keys--;
			}

			/* All children must now point up to the same parent. */

			for (i = 0; i < neighbor.num_keys + 1; i++) {
				tmp = neighbor.pointers[i];
				tmp.parent = neighbor;
			}
		}

		/* In a leaf, append the keys and pointers of n to the neighbor.
		* Set the neighbor's last pointer to point to what had been n's right neighbor.	*/

		else {
			for (i = neighbor_insertion_index, j = 0; j < n.num_keys; i++, j++) {
				neighbor.keys[i] = n.keys[j];
				neighbor.pointers[i] = n.pointers[j];
				neighbor.num_keys++;
			}
			neighbor.pointers[this.order - 1] = n.pointers[this.order - 1];
		}

		if (!split) {
			root = this.delete_entry(root, n.parent, k_prime, n);
			delete n.keys;
			delete n.pointers;
			delete n; 
		}
		else
			for (i = 0; i < n.parent.num_keys; i++)
				if (n.parent.pointers[i + 1].equals(n)) {
					n.parent.keys[i] = new_k_prime;
					break;
				}

		return root;
	},
	
	redistribute_nodes: function( root, n, neighbor, neighbor_index, k_prime_index, k_prime) {  
		var i;
		var tmp;

		/* Case: n has a neighbor to the left. Pull the neighbor's last key-pointer pair over
		* from the neighbor's right end to n's left end. */
		if (neighbor_index != -1) {
			if (!n.is_leaf)
				n.pointers[n.num_keys + 1] = n.pointers[n.num_keys];
			for (i = n.num_keys; i > 0; i--) {
				n.keys[i] = n.keys[i - 1];
				n.pointers[i] = n.pointers[i - 1];
			}
			if (!n.is_leaf) {
				n.pointers[0] = neighbor.pointers[neighbor.num_keys];
				tmp = n.pointers[0];
				tmp.parent = n;
				neighbor.pointers[neighbor.num_keys] = null;
				n.keys[0] = k_prime;
				n.parent.keys[k_prime_index] = neighbor.keys[neighbor.num_keys - 1];
			}
			else {
				n.pointers[0] = neighbor.pointers[neighbor.num_keys - 1];
				neighbor.pointers[neighbor.num_keys - 1] = null;
				n.keys[0] = neighbor.keys[neighbor.num_keys - 1];
				n.parent.keys[k_prime_index] = n.keys[0];
			}
		}
		/* Case: n is the leftmost child. Take a key-pointer pair from the neighbor to the right.
		* Move the neighbor's leftmost key-pointer pair to n's rightmost position.	*/
		else {  
			n.keys[n.num_keys] = k_prime;
			if (n.is_leaf)
				n.pointers[n.num_keys] = neighbor.pointers[0];
			else {
				n.pointers[n.num_keys + 1] = neighbor.pointers[0];
				tmp = n.pointers[n.num_keys + 1];
				tmp.parent = n;
			}
			n.parent.keys[k_prime_index] = neighbor.keys[0];
			for (i = 0; i < neighbor.num_keys; i++) {
				neighbor.keys[i] = neighbor.keys[i + 1];
				neighbor.pointers[i] = neighbor.pointers[i + 1];
			}
			if (!n.is_leaf)
				neighbor.pointers[i] = neighbor.pointers[i + 1];
		}

		/* n now has one more key and one more pointer; the neighbor has one fewer of each.	*/
		n.num_keys++;
		neighbor.num_keys--;

		return root;
	},
		
	delete_entry: function ( root, n, key, pointer ) {
		var min_keys;
		var neighbor;
		var neighbor_index;
		var k_prime_index, k_prime;
		var capacity;

		// Remove key and pointer from node.
		n = this.remove_entry_from_node(n, key, pointer);

		/* Case:  deletion from the root. */
		if (n == root) 
			return this.adjust_root(root);

		/* Case:  deletion from a node below the root. (Rest of function body.)	*/
		/* Determine minimum allowable size of node, to be preserved after deletion. */
		min_keys = n.is_leaf ? this.cut(this.order - 1) : this.cut(this.order) - 1;

		/* Case:  node stays at or above minimum. (The simple case.) */
		if (n.num_keys >= min_keys)
			return root;

		/* Case:  node falls below minimum. Either coalescence or redistribution is needed.	*/
		/* Find the appropriate neighbor node with which to coalesce. Also find the key (k_prime) in the parent
		* between the pointer to node n and the pointer to the neighbor. */
		neighbor_index = this.get_neighbor_index( n );
		k_prime_index = neighbor_index == -1 ? 0 : neighbor_index;
		k_prime = n.parent.keys[k_prime_index];
		neighbor = neighbor_index == -1 ? n.parent.pointers[1] : n.parent.pointers[neighbor_index];
		capacity = n.is_leaf ? this.order : this.order - 1;

		/* Coalescence. */
		if (neighbor.num_keys + n.num_keys < capacity)
			return this.coalesce_nodes(root, n, neighbor, neighbor_index, k_prime);

		/* Redistribution. */
		else
			return this.redistribute_nodes(root, n, neighbor, neighbor_index, k_prime_index, k_prime);
	},

	/* Master deletion function. */
	Delete: function( root, key) {
		var key_leaf;
		var key_record;

		key_record = this.find(root, key);
		key_leaf = this.find_leaf(root, key);
		if ( key_record && key_leaf ) {
			delete key_record;
			root = this.delete_entry(root, key_leaf, key, key_record);
		}
		else 
			alert("Key not found");
		return root;
	},

	destroy_tree_nodes: function( root ) {
		var i;
		if (root === null) return null;
		if (root.is_leaf)
			for (i = 0; i < root.num_keys; i++)
				delete root.pointers[i];
		else
			for (i = 0; i < root.num_keys + 1; i++)
				this.destroy_tree_nodes(root.pointers[i]);
		delete root.pointers;
		delete root.keys;
		delete root;
	},
	
	destroy_tree: function( root ) {
		this.destroy_tree_nodes(root);
		return null;
	}
	
    /* More to follow */
}

var myBPT = new BPLusTree();

var root = null;
var r;

function doOrder(orderList)
{
    var myindex  = orderList.selectedIndex;
    var SelValue = orderList.options[myindex].text;
	doDestroy();
	myBPT.order = parseInt(SelValue);
}

function doInsert()
{
	var strKey = document.getElementById('inputKey').value;
	var strData = document.getElementById('inputData').value;
	if (strKey=="") {alert("Please provide key"); return;}
	if (isNaN(strKey)) {alert("Key must be numeric"); return;}
	myBPT.bubbooID++;
	root = myBPT.insert(root, parseFloat(strKey), strData);
	myBPT.print_tree(root);
}

function doFind()
{
	if (root === null) {alert("Tree is Empty!"); return;}
	/*if (root === null) {$('#printLeaves').modal("show"); return;}*/
	var strFind = document.getElementById('findKey').value;
	if (strFind=="") {alert("Please provide key"); return;}
	if (isNaN(strFind)) {alert("Key must be numeric"); return;}
	r = myBPT.find(root, strFind);
	if (r === null)
		alert("Record not found under key " + strFind);
	else 
		alert("Record at key " + strFind + " value " + r.value);
}

function doFindRange()
{
	if (root === null) {alert("Tree is Empty!"); return;}
	var strMin = document.getElementById('minRange').value;
	if (strMin=="") {alert("Please provide Minimum Range"); return;}
	if (isNaN(strMin)) {alert("Minimum Range must be numeric"); return;}
	
	var strMax = document.getElementById('maxRange').value;
	if (strMax=="") {alert("Please provide Maximum Range"); return;}
	if (isNaN(strMax)) {alert("Maximum Range must be numeric"); return;}	
	
	if (strMin > strMax) {alert ("The range is not valid"); return;}
	
	var str_r = myBPT.findRange(root, strMin, strMax);
	if (str_r === null)
		alert("No Records found in the range [" + strMin + ", " + strMax + "]");
	else 
		alert("Records found in the range [" + strMin + ", " + strMax + "] are " + str_r);
}

function doDelete()
{
	if (root === null) {alert("Tree is Empty!"); return;}
	var strKey = document.getElementById('deleteKey').value;
	if (strKey=="") {alert("Please provide key"); return;}
	if (isNaN(strKey)) {alert("Key must be numeric"); return;}
	root = myBPT.Delete(root, strKey);
	myBPT.print_tree(root);
}

function doDestroy()
{
	root = myBPT.destroy_tree(root);
	myBPT.print_tree(root);
}

function doPrintLeaves()
{
	myBPT.print_leaves(root);
}

function doPrintTree()
{
	myBPT.print_tree(root);
}