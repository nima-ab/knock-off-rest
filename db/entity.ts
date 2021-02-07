import { number, string } from "joi";

export type EntityOptions<T> = {
    tableName?: string;
    collection?: string;
    comment?: string;
    abstract?: boolean;
    readonly?: boolean;
  };


    
export abstract class Entity<T = any> {
    public properties;
    public props;
    private primaryKeys = [];
    
    constructor() {
      this.properties = {} as any;
      this.props = {} as any;
      this.primaryKeys = [];
    }
  
    addProperty(prop: EntityProperty<T>) {
      this.properties[prop.name] = prop;
      this.props[prop.name] = undefined;

    }

    setProperty(name : string, value: any) : void 
    {
        // if(!(this.properties[name].type === typeof value))
        //     throw new Error(`property type is wrong, type should be ${this.properties[name].type}`)
        if(this.properties.hasOwnProperty(name))
            this.props[name] = value;
    }
    removeProperty(name: string) {
      delete this.properties[name];
        
    }
  
    getProps(pk: string): EntityProperty<T>[] {
      return this.props[pk];
    }

    toObject() : string{
        const allprops = {} as any
        console.log(this.props)
        for (const iterator of Object.keys(this.properties)) {
            // console.log(iterator)
            allprops[iterator]  = this.props[iterator]
        }
        console.log(allprops)
        return  allprops
    }
}


export interface EntityProperty<T = any> {
    name: string & keyof T;
    type: string;
    primary: boolean;
    object?: boolean;
    unique?: boolean | string;
    nullable?: boolean;
    inherited?: boolean;
    items?: (number | string)[];
    setter?: boolean;
    getter?: boolean;
    getterName?: keyof T;
    onDelete?: 'cascade' | 'no action' | 'set null' | 'set default' | string;
    // owner: boolean;
  }

  export class User extends Entity{
    
        constructor(name: string, email: string , id: string){
            super()
            Object.setPrototypeOf(this, User.prototype)
            this.addProperty({name:"name",type:typeof( string), primary:true})
            this.addProperty({name:"email",type:typeof (string), primary:true})
            this.addProperty({name:"id",type:typeof (number), primary:true})

            this.setProperty("name", name)
            this.setProperty("email", email)
            this.setProperty("id" , id)
        }

        

  } 



