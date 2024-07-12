#include <stdio.h>
#include <stdbool.h>

int main(){
	printf("Locsolóvers feljegyző program\n");
	FILE* fp = fopen("locsoloversek.txt","a+");
	if(!fp)
	{
		printf("Fájl nem található!\n");
		printf("A fájlt 'locsoloversek.txt' néven kell elnevezni!\n");
		return -1;
	}
	bool kilepes=false;
	do{
		int valasztas;
		printf("Mit szeretne csinálni?\n");
		printf("1. Új verset fölvenni\n");
		printf("2. Listázni a már meglévő verseket\n");
		printf("3. Törölni egy adott sorszámú verset\n");
		printf("4. Módosítani egy adott sorszámú verset\n");
		printf("5. Kilépés a programból\n");
		scanf("%d",&valasztas);
		switch(valasztas){
			//Feljegyzés
			case 1:
			printf("Hány soros verset szeretne feljegyezni?\n");
			int sordb=0;
			scanf("%d",&sordb);
			fprintf(fp,"#");
			printf("Most pedig írja be a verset!\n");
			for (int i=0; i<=sordb;i++){
			char input[300];
			fgets(input,300,stdin);
			fprintf(fp,input);
			}
			break;
			//Kiírás
			case 2:;
			char be[300];
			int counter=0;
			while(fgets(be,300,fp)){
				if( (char) be[0] == '#'){
					counter++;
					printf("%d. vers:\n",counter);
				}else{
				printf("%s",be);
				}
			}
			break;
			//Törlés
			case 3:
			printf("Adja meg a törölni kívánt vers sorszámát!\n");
			int versszam;
			scanf("%d",&versszam);
			FILE* tmp = fopen("tmp.txt","w");
			if(!tmp){
				printf("Ideiglenes fájl megnyitása sikertelen!\n");
				return -1;
			}
			char buffer[300];
			int counter2=0;
			while(fgets(buffer,300,fp)){
				if((char) buffer[0]=='#'){
					counter2++;
				}
				if(counter2!=versszam){
					fprintf(tmp,buffer);
				}
			}
			fclose(tmp);
			remove("locsoloversek.txt");
			rename("tmp.txt","locsoloversek.txt");
			fp= fopen("locsoloversek.txt","a+");
			break;
			//Módosítás
			case 4:
			printf("Adja meg a módosítani kívánt vers sorszámát!\n");
			int modszam;
			scanf("%d",&modszam);
			FILE* tmp2 = fopen("tmp2.txt","w");
			if(!tmp2){
				printf("Ideiglenes fájl megnyitása sikertelen!\n");
				return -1;
			}
			char buffer2[300];
			int counter3=0;
			bool modositva=false;
			while(fgets(buffer2,300,fp)){
				if((char)buffer2[0]=='#'){
					counter3++;
				}
				if(counter3!=modszam){
					fprintf(tmp2,buffer2);
				}else if(!modositva){
					int ujsorszam;
					printf("Adja meg, hogy a vers módosított verziójának hány sora van!\n");
					scanf("%d",&ujsorszam);
					fprintf(tmp2,"#");
					printf("Most pedig írja be a módosított verset!\n");
					for(int i=0;i<=ujsorszam;++i){
						char input2[300];
						fgets(input2,300,stdin);
						fprintf(tmp2,input2);
					}
					modositva=true;
				}
			}
			fclose(tmp2);
			remove("locsoloversek.txt");
			rename("tmp2.txt","locsoloversek.txt");
			fp=fopen("locsoloversek.txt","a+");
			if(!fp){
				printf("Fájl megnyitás sikertelen!\n");
				return -1;
			}
			break;
			//Kilépés
			case 5:
			kilepes=true;
			break;
			default:
			printf("Ilyen opció nincs! A következők közül válasszon!\n");
		}
		fseek(fp,0,SEEK_SET);
	}while(!kilepes);
	fclose(fp);
}
