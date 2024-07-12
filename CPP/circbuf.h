#ifndef CIRCBUF_H
#define CIRCBUF_H
#include <vector>

template <typename T>
class circular_buffer{
    public:
        circular_buffer(T* array,int size){
            this->array=array;
            this->c=size;
            this->insert_c=0;
            this->read_c=0;
        }
    
        void insert(T t){
            if(insert_c-c<read_c){
                array[insert_c%c]=t;
                insert_c++;
            }
        }

        T read() {
            if(insert_c>read_c){
                T temp = array[(read_c%c)];
                read_c++;
                return temp;
            }else{
                return array[0];
            }
        }

        int capacity () const {
            return c;
        }

        int size () const {
            return insert_c-read_c;
        }

    private:
        T* array;
        int c;
        int insert_c;
        int read_c;
};


#endif