

context('scripts', () => {
    before(() => {
        cy.visit('/navigator');
    });
    it('setInstanceProperty set inner property value', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var obj = { inner: { id: 1 } };
                b.setInstanceProperty(obj, "inner.id", 2);
                expect(obj.inner.id).to.eq(2);
            });
    });

    it('setInstanceProperty set property value', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var obj = { field: 1 };
                b.setInstanceProperty(obj, "field", 2);
                expect(obj.field).to.eq(2);
            });
    });

    it('getInstanceProperty return property', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var obj = { inner: { id: 1 } };
                expect(b.getInstanceProperty(obj, "inner.id")).to.eq(1);
            });
    });

    it('getInstanceProperty return on array index', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var obj = [{ id: 1 }];
                expect(b.getInstanceProperty(obj, "[0].id")).to.eq(1);
            });
    });


    it('getInstanceProperty return instance if empty string', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var obj = { inner: { id: 1 } };
                expect(b.getInstanceProperty(obj, "")).to.eq(obj);
            });
    });


    it('getInstancePropertySerializable return null if property null', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var obj = { field: null };
                expect(b.getInstancePropertySerializable(obj, "field")).to.eq(null);
            });
    });

    it('callInstanceMethod call instance method with parameters', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var obj = { method: function (a, b) { } };
                cy.spy(obj, 'method');
                b.callInstanceMethod(obj, "method", "A", "B")
                expect(obj.method).to.be.called.calledWith("A", "B");
            });
    });


    it('callInstanceMethod change null parameters to undefined', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var obj = { method: function (a, b) { } };
                cy.spy(obj, 'method');
                b.callInstanceMethod(obj, "method", null, null)
                expect(obj.method).to.be.called.calledWith(undefined, undefined);
            });
    });

    it('getSerializableObject return match specs', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var obj = {
                    id: 1,
                    inner: { id: 2 },
                    ignored: "aaa",
                    array: [{
                        id: 1,
                        ignored: 2
                    }],
                    ignoredArray: [{
                        id: 1,
                        ignored: 2
                    }],

                };
                var res = b.getSerializableObject(obj, [], {
                    id: true,
                    inner: "*",
                    array: {
                        id:true
                    },
                    ignoredArray: false
                });
                expect(res).to.have.property('id');
                expect(res).to.have.property('inner');
                expect(res).to.have.property('array');
                expect(res).not.to.have.property('ignored');
                expect(res).not.to.have.property('ignoredArray');
                expect(res.array[0]).to.have.property('id');
                expect(res.array[0]).not.to.have.property('ignored');
            });
    });

    it('getSerializableObject return match specsif root array', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var obj = [{
                    id: 1,
                    inner: { id: 2 },
                    ignored: "aaa",
                    array: [{
                        id: 1,
                        ignored: 2
                    }],
                    ignoredArray: [{
                        id: 1,
                        ignored: 2
                    }],

                }];
                var resArr = b.getSerializableObject(obj, [], {
                    id: true,
                    inner: "*",
                    array: {
                        id: true
                    },
                    ignoredArray: false
                });
                var res = resArr[0]
                expect(res).to.have.property('id');
                expect(res).to.have.property('inner');
                expect(res).to.have.property('array');
                expect(res).not.to.have.property('ignored');
                expect(res).not.to.have.property('ignoredArray');
                expect(res.array[0]).to.have.property('id');
                expect(res.array[0]).not.to.have.property('ignored');
            });
    });

    it('getSerializableObject return all layer when spec is not given', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var obj = { id: 1, inner: { id: 2 } };
                var res = b.getSerializableObject(obj, []);
                expect(res).to.have.property('id');
                expect(res).to.have.property('inner');
            });
    });


    it('getSerializableObject return none layer when spec is false', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var obj = { id: 1, inner: { id: 2 } };
                var res = b.getSerializableObject(obj,[], false);
                expect(res).to.be.eq(undefined);
            });
    });


    it('getInstancePropertySerializable returns promise', () => {
        cy.window()
            .then(w => {
                cy.window()
                    .its('browserInterop')
                    .then(b => {
                        var obj = { member: w.Promise.resolve("test") };
                        var res = b.getInstancePropertySerializable(obj, 'member');
                        expect(res).to.be.a('promise');
                    });

            });
    });
    it('getInstancePropertySerializable serialize 0', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var obj = { id: 0 };
                var res = b.getInstancePropertySerializable(obj, 'id');
                expect(res).to.be.eq(0);
            });
    });
    it('getInstancePropertySerializable serialize boolean', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var obj = { field1: true, field2: false };
                var res = b.getInstancePropertySerializable(obj, 'field1');
                expect(res).to.be.eq(true);
                res = b.getInstancePropertySerializable(obj, 'field2');
                expect(res).to.be.eq(false);
            });
    });
    it('getSerializableObject serialize array', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var obj = [1, 2];
                var res = b.getSerializableObject(obj, [], "*");
                expect(res).to.be.eql(obj);
            });
    });
    it('callInstanceMethod apply to sub property if method is in child', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var obj = new (function () {
                    this.id = 1;
                    this.child = new (function () {
                        this.id = 2;
                        this.getId = function () {
                            return this.id;
                        };
                    })();
                })();
                var res = b.callInstanceMethod(obj, 'child.getId');
                expect(res).to.be.eq(2);
            });
    });

    it('callInstanceMethodGetRef retruns object ref', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var tmp = { id: 3 };
                var obj = new (function () {
                    this.method = function () {
                        return tmp;
                    }
                })();
                var ref = b.callInstanceMethodGetRef(obj, 'method');
                var res = b.jsObjectRefRevive(null, ref);
                expect(res).to.be.eq(tmp);
            });
    });

    it('addEventListener register method', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var test = cy.stub();
                b.addEventListener(window, "", "testevt", test);
                window.dispatchEvent(new Event("testevt"));
                expect(test).to.be.calledOnce;

            });
    });


    it('addEventListener return id for unregister', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var test = cy.stub();
                var id = b.addEventListener(window, "", "testevt", test);
                b.removeEventListener(window, "", "testevt", id);
                window.dispatchEvent(new Event("testevt"));
                expect(test).to.not.be.calledOnce;

            });
    });

    it('setInstanceProperty set array index', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var test = [{ id: 1 }];
                b.setInstanceProperty(test, "[0].id", 2);
                expect(test[0].id).to.be.eq(2);

            });
    });

    it('jsObjectRefRevive returns instance with serialized key from storeObjectRef', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var test = [{ id: 1 }];
                var key = b.storeObjectRef(test);
                var test2 = b.jsObjectRefRevive("", JSON.parse(JSON.stringify(key)));
                expect(test).to.be.eq(test);


            });
    });
    it('removeObjectRef makes future call fail', () => {
        cy.window()
            .its('browserInterop')
            .then(b => {
                var test = [{ id: 1 }];
                var key = b.storeObjectRef(test);
                b.removeObjectRef(key['__jsObjectRefId']);
                var test2 = null;
                try {
                    test2 = b.jsObjectRefRevive("", JSON.parse(JSON.stringify(key)));
                } catch{

                }
                expect(test2).to.be.eq(null);


            });
    });
});
